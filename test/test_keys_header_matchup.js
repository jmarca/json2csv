/*eslint-env node, mocha */
// test extracting keys
var extract = require('../lib/extract_keys.js')
require('should')

describe('extract keys',function(){
    it('header and keys should match up',function(){

        var header = [
            {
                "key": "bar",
                "order": 0,
                "skip": true
            },
            {
                "key": "baz",
                "order": 1,
                "skip": false
            },
            {
                "key": "foo",
                "order": 0,
                "skip": false,
                "header": "fooey on you"
            },
            {
                "key": "detectors",
                "order": 2,
                "skip": false
            }
        ]
        var cols = ['foo','bar','baz']
        var obj=[]
        var i
        var row
        for(i=0;i<10;i++){
            row = {}
            cols.forEach(function(k){
                row[k]=i
                return null
            })
            obj.push(row)
        }

        extract(obj[0]).should.eql(['foo','bar','baz'])
        extract(obj[0],true).should.eql(['bar','baz','foo'])
        extract(obj[0],header).should.eql(['foo','baz','detectors'])

    })
})
