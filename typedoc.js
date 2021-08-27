/** @type import("typedoc").TypeDocOptions */
const options = {
  entryPoints: ['src/index.ts'],
  theme: './node_modules/typedoc-neo-theme/bin/default',
  out: './docs/api',
  readme: 'none',
  // Commented out due to https://github.com/google/typedoc-neo-theme/issues/75
  // links: [
  //   { label: 'Guide', url: '../' },
  //   { label: 'GitHub', url: 'https://github.com/adalinesimonian/jshiki' },
  //   { label: 'NPM', url: 'https://www.npmjs.com/package/jshiki' },
  //   { label: 'Yarn', url: 'https://yarnpkg.com/package/jshiki' },
  // ],
}

module.exports = options
