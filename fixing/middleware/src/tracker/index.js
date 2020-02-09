const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const URL = require('url')
const capturer = require('chrome-har-capturer')
const utils = require('./utils')

const cdpPort = 9222
// const harDir = '/Users/zzf/scheduler/hars/'
const harDir = path.resolve(`${process.cwd()}`, 'hars')

const recordPage = (page, pageUrl, harPath) => new Promise(async (resolve, reject) => {
  // no need to call `reject` or `resolve` again if anything goes wrong
  let fulfilledPromise = false

  const urlManager = utils.createUrlManager(page)

  const disposableReject = (error) => {
    if (fulfilledPromise) {
      return
    }

    fulfilledPromise = true
    if (error.message.startsWith('Navigation Timeout Exceeded')) {
      const urls = urlManager.urls()
      if (urls.length > 1) {
        error.message += `\nTracked Urls that have not finished: ${urls.join(', ')}`
      } else if (urls.length > 0) {
        error.message += `\nTrack failed: ${urls[0]}`
      }
    }
    urlManager.detach()

    // TODO
    reject(error)
  }

  try {
    page.on('pageerror', (error) => disposableReject(error))
    page.on('load', () => {

    })

    // here comes our new wheel! vroooooooom!
    capturer.run([pageUrl], {
      content: true,
      port: cdpPort,
      // => waitUntil: 'networkidle0'
      // ensure to capture all network traffic
      postHook: (_, cdp) => {
        return new Promise((resolve) => {
          const graceTime = 3000
          let timeoutID = setTimeout(resolve, graceTime)
          cdp.Network.requestWillBeSent((params) => {
            clearTimeout(timeoutID)
            timeoutID = setTimeout(resolve, graceTime)
          })
        })
      }
    }).on('har', (har) => {
      if (!fulfilledPromise) {
        urlManager.detach()
        resolve()
      }
      fs.writeFileSync(harPath, JSON.stringify(har))
    })

    const pageResponse = await page.goto(pageUrl, { waitUntil: 'networkidle0' })
    // const content = await page.content()
    // fs.writeFileSync(content, 'jd.html')
    if (!pageResponse || utils.isOk(pageResponse) === false) {
      return disposableReject(new Error(`${pageResponse.status()} on ${pageUrl}`))
    }
  } catch (error) {
    return disposableReject(error)
  }
})

const replayPage = (page, pageUrl, harPath) => new Promise(async (resolve, reject) => {
  // TODO: code reuse
  let fulfilledPromise = false

  const urlManager = utils.createUrlManager(page)

  const disposableReject = (error) => {
    if (fulfilledPromise) {
      return
    }

    fulfilledPromise = true
    if (error.message.startsWith('Navigation Timeout Exceeded')) {
      const urls = urlManager.urls()
      if (urls.length > 1) {
        error.message += `\nTracked Urls that have not finished: ${urls.join(', ')}`
      } else if (urls.length > 0) {
        error.message += `\nTrack failed: ${urls[0]}`
      }
    }
    urlManager.detach()

    // TODO
    console.log(error)
    // reject(error)
  }

  const entries = JSON.parse(fs.readFileSync(harPath)).log.entries

  try {
    page.on('pageerror', (error) => disposableReject(error))

    await page.setRequestInterception(true)
    page.on('request', async (request) => {
      request.parsedUrl = URL.parse(request.url(), true)
      const entry = utils.matchEntry(request, entries)

      if (entry) {
        const wrappedResponse = utils.wrapEntryResponse(entry)
        await request.respond(wrappedResponse)
      } else {
        await request.abort()
      }
    })

    const pageResponse = await page.goto(pageUrl, { waitUntil: 'networkidle0' })
    if (pageResponse && utils.isOk(pageResponse)) {
      resolve()
    } else {
      return disposableReject(new Error(`${pageUrl}`))
    }
  } catch (error) {
    return disposableReject(error)
  }
})

exports.record = async (pageUrl, harPath) => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--incognito',
      '--disable-gpu',
      `--remote-debugging-port=${cdpPort}`
    ],
    headless: false
  })
  try {
    const page = await browser.newPage()
    await recordPage(page, pageUrl, harPath)
  } catch (error) {
    console.log(error)
  } finally {
    browser.close()
  }
}

exports.track = async (pageUrl, rewritePath, logPath) => {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--incognito',
      '--disable-gpu',
      `--remote-debugging-port=${cdpPort}`
    ],
    headless: false
  })

  try {
    const page = await browser.newPage()

    const logger = fs.readFileSync(path.join('/Users/zzf/scheduler/src/scout/', 'logger.js'), 'utf8')
    // console.log(logger)
    // await page.evaluateOnNewDocument(logger)

    await replayPage(page, pageUrl, rewritePath)

    // const assignments = await page.evaluate(() => window.assignments)
    // let contents = ''
    // for (const statement of assignments) {
    //   contents += statement + '\n'
    // }
    // fs.writeFileSync(logPath, contents)
  } catch (error) {
    console.log(error)
  } finally {
    browser.close()
  }
}
