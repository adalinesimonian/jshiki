/* global process */

var jshiki = require('./parser')

console.log()

var r = jshiki.parse('" Hello! ".trim() + " My name\'s " + name', {
  scope: {
    name: 'Azumi'
  }
})
console.log(r)
r = r.eval()

console.log()
console.log()
console.log('Final result')
console.log()
console.log(JSON.stringify(r, null, 2))
console.log()
process.exit()
