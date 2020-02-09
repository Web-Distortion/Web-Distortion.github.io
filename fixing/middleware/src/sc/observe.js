const proxyObject = require('recursive-object-proxy')

const objToString = function (obj) {
  if (typeof obj === 'function') {
    return String(obj)
  }
  if (typeof obj === 'object') {
    const keys = Object.keys(obj)
    let str = '{'
    for (let i = 0; i < keys.length - 1; i++) {
      str += JSON.stringify(keys[i]) + ': ' + objToString(obj[keys[i]]) + ',\n'
    }
    if (keys.length >= 1) {
      str += JSON.stringify(keys[keys.length - 1]) + ': ' + objToString(obj[keys[keys.length - 1]]) + '\n'
    }
    str += '}'
    return str
  }
  return JSON.stringify(obj)
}

exports.test = () => {
  const window = {}
  window['a'] = {}
  window.a.b = {}
  window['a'].b.c = [1]
  window.parseInt = parseInt
  const _window_ = proxyObject(window, (path, val, isRemoved) => {
    if (isRemoved) {
      console.log(`removed ${path}`)
    } else {
      console.log(`${path} = `, objToString(val))
    }
  });

  (function (window) {
    window['a'].b.c = 2
    window.a.b.d = window.a.b.c
    window.a.b.d = 3
    window.bds = {}
    window.E = window.bds.ecom = {}
    try {
      window.bds.se = { 'loadedItems': [], 'load': function (x) {return x}, 'srvt': -1 }
      window.bds.se.srvt = window.parseInt('10')
    } catch (e) {}

    function a (b) {
      return b
    }
    window.index_on = a
  })(_window_)
}
this.test()
