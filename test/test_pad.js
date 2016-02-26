/*eslint-env node, mocha */
// test padding a string

var pad = require('../lib/pad.js')
require('should')

describe('pad1',function(){
    it('should pad out some numbers 3 wide',function(){
        var padder=pad(3)
        var i
        padder(1).should.equal('001')
        padder(10).should.equal('010')
        padder(100).should.equal('100')
        padder(1000).should.equal('1000')
        console.time('1000-elements-tab1')
        for ( i = 0; i < 100000; i++) {
            padder(i)
        }
        console.timeEnd('1000-elements-tab1')
        padder = pad(3,'a')
        padder(10).should.equal('a10')

    })
})

// describe('pad2',function(){
//     it('should pad out some numbers 3 wide',function(){
//         var padder=pad.pad2(3)
//         padder(1).should.equal('001')
//         padder(10).should.equal('010')
//         padder(100).should.equal('100')
//         padder(1000).should.equal('1000')
//         console.time('1000-elements-tab2');
//         for (var i = 0; i < 100000; i++) {
//             padder(i)
//         }
//         console.timeEnd('1000-elements-tab2');
//     })
// })
