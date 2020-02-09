const fs = require('fs')
const cheerio = require('cheerio')
const rewriter = require('../sc/rewriter')

const replace = (harPath, rewritePath) => {
  const data = fs.readFileSync(harPath, 'utf8')
  const content = JSON.parse(data.toString())
  const entries = content.log.entries
  let flag = 0

  for (const entry of entries) {
    if (entry.response.content.mimeType === 'application/javascript' || entry.response.content.mimeType === 'application/x-javascript') {
      const rewriteEntry = rewriter.windowRewrite(entry.response.content.text)
      entry.response.content.text = rewriteEntry
    }
    if (entry.response.content.mimeType === 'text/html') {
      if (Math.floor(entry.response.status / 100) === 2) {
        const $ = cheerio.load(entry.response.content.text)
        const scripts = $('script')
        for (let i = 0; i < scripts.length; i++) {
          if (scripts[i].childNodes !== undefined && scripts[i].childNodes.length > 0) {
            scripts[i].childNodes[0].data = rewriter.windowRewrite(scripts[i].childNodes[0].data)
          }
        }
        // console.log($.html())
        if (flag === 0) {
          fs.writeFileSync('/Users/zzf/scheduler/test_webpage/bing.html', $.html())
          flag = 1
        }
        entry.response.content.text = $.html()
        // console.log(entry.response.content.text)
      }
    }
  }
  const rewriteData = JSON.stringify(content)
  fs.writeFileSync(rewritePath, rewriteData)
}

exports.replace = replace
