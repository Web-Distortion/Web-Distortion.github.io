const URL = require('url')

exports.isOk = (response) => response.ok() || response.status() === 304

exports.createUrlManager = (page) => {
  const requests = new Set()
  const onStarted = (request) => requests.add(request)
  const onFinished = (request) => requests.delete(request)
  page.on('request', onStarted)
  page.on('requestfinished', onFinished)
  page.on('requestfailed', onFinished)
  return {
    urls: () => Array.from(requests).map(r => r.url()),
    detach: () => {
      page.removeListener('request', onStarted)
      page.removeListener('requestfinished', onFinished)
      page.removeListener('requestfailed', onFinished)
    }
  }
}

const stripProtocol = (raw) => typeof raw === 'string' ? raw.replace(/^https?/, '') : raw

// OK fine let's create the wheel:) and wish nodejs to implement `Object.fromEntries` asap :)
const mapHeaders = (headers) => Object.assign({}, ...headers.map(h => ({ [h.name.toLowerCase()]: h.value })))

const rate = (request, entry) => {
  const entryRequest = entry.request
  let score = 0

  // 1st level: method, host and pathname
  // must be matched!!!
  if (entryRequest.method !== request.method() ||
    (request.parsedUrl.host !== null && entryRequest.parsedUrl.host !== request.parsedUrl.host) ||
    entryRequest.parsedUrl.pathname !== request.parsedUrl.pathname) {
    return 0
  }
  score += 1

  // 2nd level: query
  const requestQuery = request.parsedUrl.query
  const entryQuery = entryRequest.parsedUrl.query
  if (entryQuery && requestQuery) {
    for (const name in requestQuery) {
      if (entryQuery[name] === undefined) {
        score -= 0.5
      } else if (stripProtocol(entryQuery[name]) === stripProtocol(requestQuery[name])) {
        score += 1
      }
    }
    for (const name in entryQuery) {
      if (requestQuery[name] === undefined) {
        score -= 0.5
      }
    }
  }

  // 3rd level: header
  var entryHeaders = entryRequest.mappedHeaders
  var requestHeaders = request.headers()
  for (const name in requestHeaders) {
    if (entryHeaders[name] && (stripProtocol(entryHeaders[name]) === stripProtocol(requestHeaders[name]))) {
      score += 1
    }
  }

  return score
}

// super super naive heuristic algorithm
exports.matchEntry = (request, entries) => {
  let topScore = 0
  let topEntry = null

  for (const entry of entries) {
    const entryRequest = entry.request
    if (!entryRequest.parsedUrl) {
      entryRequest.parsedUrl = URL.parse(entryRequest.url, true)
    }
    if (!entryRequest.mappedHeaders) {
      entryRequest.mappedHeaders = mapHeaders(entryRequest.headers)
    }

    const score = rate(request, entry)
    if (score > topScore) {
      topScore = score
      topEntry = entry
    }
  }

  return topEntry
}

const isBase64Encoded = (entryResponse) => {
  if (!entryResponse.content.text) {
    return false
  }
  const base64Size = entryResponse.content.size / 0.75
  const contentSize = entryResponse.content.text.length
  return contentSize && (contentSize >= base64Size) && (contentSize <= base64Size + 4)
}

exports.wrapEntryResponse = (entry) => {
  const entryResponse = entry.response

  if (!entryResponse.mappedHeaders) {
    entryResponse.mappedHeaders = mapHeaders(entryResponse.headers)
    // XXX
    // puppeteer does not support nonstandard headers
    delete entryResponse.mappedHeaders['set-cookie']
    delete entryResponse.mappedHeaders['cache-control']
  }

  if (!entryResponse.content.buffer) {
    if (isBase64Encoded(entryResponse)) {
      entryResponse.content.buffer = Buffer.from(entryResponse.content.text || '', 'base64')
    } else {
      entryResponse.content.buffer = Buffer.from(entryResponse.content.text || '', 'utf8')
    }
  }

  return {
    status: entryResponse.status,
    headers: entryResponse.mappedHeaders,
    body: entryResponse.content.buffer
  }
}
