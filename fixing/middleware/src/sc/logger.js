assignments = []
const objToString = function (obj) {
  if (typeof obj === 'function') {
    return String(obj)
  }
  if (typeof obj === 'object') {
    if (obj === null) {
      return obj
    }
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

const domProxy = (obj, path) => {
  const domHandler = {
    get: (target, key) => {
      const value = Reflect.get(target, key)
      const tmp = path
      path += key + '.'
      if (typeof value === 'object') {
        const rp = domProxy(value, path)
        path = tmp
        return rp
      }
      if (typeof value === 'function') {
        const rp = domProxy(value.bind(target), path)
        path = tmp
        return rp
      }
      path = tmp
      console.log(path)
      assignments.push(`${path}`)
      return value
    },
    set: (target, key, value) => {
      console.log(path + key + ' = ' + objToString(value))
      assignments.push(path + key + ' = ' + objToString(value))
      return Reflect.set(target, key, value)
    }
  }
  return new Proxy(obj, domHandler)
}

const windowProxy = (obj, path) => {
  const recursiveHandler = {
    get: (target, key) => {
      const value = Reflect.get(target, key)
      const tmp = path
      if (typeof value === 'object') {
        path += key + '.'
        const rp = windowProxy(value, path)
        path = tmp
        return rp
      }
      if (typeof value === 'function') {
        path += key 
        const rp = windowProxy(value.bind(target), path)
        path = tmp
        return rp
      }
      path = tmp
      return value
    },
    set: (target, key, value) => {
      console.log(path + key + ' = ' + objToString(value))
      assignments.push(path + key + ' = ' + objToString(value))
      return Reflect.set(target, key, value)
    },
    apply (target, ctx, args) {
      const value = Reflect.apply(...arguments)
      path += '('
      if (args.length > 1) {
        for (let i = 0; i < args.length-1; i++) {
          path += JSON.stringify(args[i]) + ','
        }
        path += JSON.stringify(args[args.length-1])
      }
      if (args.length === 1) {
        path += JSON.stringify(args[0])
      }
      path += ')'
      if (value instanceof Element) {
        path += '.'
        return domProxy(value, path)
      }
      return value
    }
  }
  return new Proxy(obj, recursiveHandler)
}

const _window_ = windowProxy(window, '')