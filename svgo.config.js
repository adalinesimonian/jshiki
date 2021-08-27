/** @type {import('svgo').CustomPlugin} */
const finalEOLPlugin = {
  name: 'finalEOL',
  type: 'full',
  fn: ast => {
    ast.children.push({
      type: 'text',
      value: '\n',
    })
    return ast
  },
}

/** @type {import('svgo').OptimizeOptions} */
const options = {
  plugins: [
    {
      name: 'preset-default',
    },
    {
      name: 'removeAttrs',
      params: {
        attrs: ['data-name'],
      },
    },
    finalEOLPlugin,
  ],
}

module.exports = options
