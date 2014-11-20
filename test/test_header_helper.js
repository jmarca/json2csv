// test extracting keys
var should = require('should')
var fs =  require('fs')
var header_helper = require('../lib/header_helper.js')
var extract = require('../lib/extract_keys.js')

var file = 'header_helper.js'

after(function(done){
    fs.unlink(file,done)
})
describe('basic object dump',function(){
    it('should write out basic object',function(done){
        var head = ['foo','bar','baz']
        var sorted_head = head.sort()
        var obj=[]
        for(var i=0;i<10;i++){
            var row = {}
            head.forEach(function(k){
                row[k]=i
                return null
            })
            obj.push(row)
        }
        header_helper(file,obj,function(e,r){
            should.not.exist(e)
            var test = require('../'+file)
            test.should.be.an.instanceOf(Array);

            test.forEach(function(v,idx){
                v.order.should.equal(idx)
                v.key.should.equal(sorted_head[idx])
                v.skip.should.not.be.ok;
                (v.header===undefined).should.be.ok
            })

            return done()
        })
    })
})
