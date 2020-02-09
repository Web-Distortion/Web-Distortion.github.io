const esprima = require('esprima')
const estraverse = require('estraverse')
const escope = require('escope')

const isFunctionClosure = (node) => node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression'

const isOriginalVariable = (node, parent) => node.name !== 'window' && node.type === 'Identifier' && parent.type !== 'FunctionDeclaration' && parent.type !== 'Property' && parent.type !== 'CatchClause' && (parent.type !== 'MemberExpression' || parent.object.range[1] === node.range[1])

const isGlobalVariable = (node, currentScope) => {
  if (currentScope.type === 'global') {
    return true
  }
  for (const scopeVar of currentScope.variables) {
    if (scopeVar.name === node.name) {
      return false
    }
  }
  return isGlobalVariable(node, currentScope.upper)
}

let idx = 0
const nameSet = new Set()
exports.windowRewrite = (source) => {
  const ast = esprima.parseScript(source, { range: true })

  // 1st traverse: maintain scope map (*wheel! awesome wheel! wwwww
  const scopeManager = escope.analyze(ast)
  const globalScope = scopeManager.acquire(ast)
  
  // 2nd traverse: examine all variable declarations and references
  globalScope.variables.forEach((variable) => {
    variable.defs.forEach((def) => {
      if (def.type === 'Variable') {
        const spaceStart = def.parent.range[0]
        const spaceLen = def.kind.length
        const spaces = ' '.repeat(spaceLen)
        source = source.slice(0, spaceStart) + spaces + source.slice(spaceStart + spaceLen)
      }
    })
  })

  let currentScope = globalScope
  const entries = []
  estraverse.traverse(ast, {
    enter: (node, parent) => {
      if (isOriginalVariable(node, parent) && isGlobalVariable(node, currentScope)) {
        if (!nameSet.has(node.name)) {
          entries.push({
            start: node.range[0],
            end: node.range[1],
            id: idx++
          })
          nameSet.add(node.name)
        } else {
          entries.push({
            start: node.range[0],
            end: node.range[1]
          })
        }
      }
      if (isFunctionClosure(node)) {
        currentScope = scopeManager.acquire(node)
      }
    },
    leave: (node, parent) => {
      if (isFunctionClosure(node)) {
        currentScope = currentScope.upper
      }
    }
  })

  entries.sort((a, b) => b.end - a.end).forEach((entry) => {
    const obj = source.slice(entry.start, entry.end)
    source = source.slice(0, entry.start) + 'window.' + source.slice(entry.start)
    // if (entry.id !== undefined) source += '\nwindow.' + obj + '._id = ' + entry.id
  })

  // 3rd traverse: hoist global function expressions to the top
  const globalFunctions = globalScope.variables.filter((variable) => {
    for (const def in variable.defs) {
      if (def.type === 'FunctionName') {
        return true
      }
    }
    return false
  })
  let tmpHoist = ''
  globalFunctions.forEach((func) => {
    tmpHoist = tmpHoist + 'window.' + func.name + '=' + func.name + ';'
  })
  source = tmpHoist + source

  // wrap the source code in a closure to define a local alias for `window`
  source = '(function (window) {' + source + '})(_window_);'

  return source
}
