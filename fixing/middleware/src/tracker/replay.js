const fs = require('fs')
const cheerio = require('cheerio')
const replay = (harPath, newHTMLPagePath, logPath) => {
  const data = fs.readFileSync(harPath, 'utf8')
  const content = JSON.parse(data.toString())
  const entries = content.log.entries
  const logger = fs.readFileSync(logPath, 'utf8')
  const cmds = logger.toString()
  // console.log(cmds)
  for (const entry of entries) {
    if (entry.response.content.mimeType === 'text/html') {
      if (Math.floor(entry.response.status / 100) === 2) {
        const $ = cheerio.load(entry.response.content.text, {decodeEntities: true})
        const scripts = $('script')
        for (let i = 0; i < scripts.length; i++) {
          if (scripts[i].childNodes.length > 0) {
            // console.log(scripts[i].childNodes[0].data)
            scripts[i].childNodes[0].data = ''
          } else {
            if ('src' in scripts[i].attribs) {
              scripts[i].attribs.src = ''
            }
          }
        }
        scripts.last().append(cmds)
        fs.writeFileSync(newHTMLPagePath, $.html())
        break
      }
    }
  }
}
exports.replay = replay
// replay('/Users/zzf/scheduler/hars/pika.har', '/Users/zzf/scheduler/test_webpage/newpika.html')
