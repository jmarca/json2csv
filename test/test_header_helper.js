/*eslint-env node, mocha */
// test extracting keys

var fs =  require('fs')
var header_helper = require('../lib/header_helper.js')

var should = require('should')

describe('basic object dump',function(){
    var head = ['foo','bar','baz']
    var sorted_head = head.sort()
    var obj=[]
    var obj2
    var i
    var row
    for(i=0;i<10;i++){
        row = {}
        head.forEach(function(k){
            row[k]=i
            return null
        })
        obj.push(row)
    }
    obj2 = obj[0]
    describe('array of objects',function(){
        var file = 'testing_header_helperA.js'
        after(function(done){
            fs.unlink(file,done)
        })
        it('should write out basic object',function(done){

            header_helper(file,obj,function(e,r){
                var test
                should.not.exist(e)
                test = require('../'+file)
                test.should.be.an.instanceOf(Array)
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
    describe('singleton object',function(){
        var file = 'testing_header_helperB.js'
        after(function(done){
            fs.unlink(file,done)
        })

        it('should write out a one-row object',function(done){

            header_helper(file,obj2,function(e,r){
                var test
                should.not.exist(e)
                test = require('../'+file)
                test.should.be.an.instanceOf(Array)
                test.length.should.eql(3)
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
})
