/*eslint-env node, mocha */
// test extracting keys
var json2csv = require('../lib/json2csv.js')
var fs =  require('fs')
var filenum = 0
require('should')

describe('ways to fail',function(){
    var file = 'dump'+filenum+'.txt'
    var out = fs.createWriteStream(file, { encoding: 'utf8' })
    filenum++
    it('should fail on bad input',function(done){
        function f(){
            json2csv({})
            return null
        }
        function f2(){
            json2csv({outstream:out
                      ,encoding:'utf8'})
            return null
        }
        f.should.throw()
        f2.should.throw()
        return done()
    })
})
describe('basic object dump',function(){
    var i,row,out
    var file = 'dump'+filenum+'.txt'
    filenum++
    after(function(done){
        fs.unlink(file,done)
    })
    it('should write out basic object',function(done){
        var head = ['foo','bar','baz']
        var obj=[]

        for(i=0;i<10;i++){
            row = {}
            head.forEach(function(k){
                row[k]=i
                return null
            })
            obj.push(row)
        }
        (Array.isArray( obj)).should.be.ok()
        out = fs.createWriteStream(file, { encoding: 'utf8' })
        json2csv({objectlist:obj
                 ,header:['bar','baz','foo']
                 ,outstream:out
                 ,encoding:'utf8'},function(e,d){
            out.end()
        })
        out.on('finish',function(){
            fs.readFile(file,{encoding:'utf8'},function(err,data){
                var lines
                data.trim()
                lines = data.split(/\r?\n/)
                lines.should.have.length(12)
                lines.shift().should.eql('bar,baz,foo')
                lines.shift().should.eql('0,0,0')
                lines.shift().should.eql('1,1,1')
                lines.shift().should.eql('2,2,2')
                lines.shift().should.eql('3,3,3')
                lines.shift().should.eql('4,4,4')
                lines.shift().should.eql('5,5,5')
                lines.shift().should.eql('6,6,6')
                lines.shift().should.eql('7,7,7')
                lines.shift().should.eql('8,8,8')
                lines.shift().should.eql('9,9,9')
                lines.shift().should.eql('') // last line is empty
                return done()
            })
            return null
        })
    })
})
describe('basic object dump, no encoding specified',function(){
    var file = 'dump'+filenum+'.txt'
    filenum++
    after(function(done){
        fs.unlink(file,done)
    })
    it('should write out basic object, no header',function(done){
        var head = ['foo','bar','baz']
        var obj={}
        var i=0
        var out
        head.forEach(function(k){
            obj[k]=i
            return null
        });
        (Array.isArray( obj)).should.not.be.ok
        out = fs.createWriteStream(file, { encoding: 'utf8' })
        json2csv({objectlist:obj
                 ,outstream:out},function(e,d){
                     out.end()
                     return null
                 })
        out.on('finish',function(){
            fs.readFile(file,{encoding:'utf8'},function(err,data){
                var lines
                data.trim()
                lines = data.split(/\r?\n/)
                lines.should.have.length(2)
                lines.shift().should.eql('0,0,0')
                lines.shift().should.eql('') // last line is empty
                return done()
            })
            return null
        })
    })
})

describe('big object dump',function(){
    var file = 'dump'+filenum+'.txt'
    var big_json
    filenum++
    after(function(done){
        fs.unlink(file,done)
    })
    before(function(done){
        fs.readFile('test/06059.json',{'encoding':'utf8'},function(err,data){
            big_json = JSON.parse(data)
            return done()
        })
    })

    it('should write out big object (which also demonstrates that backpressure works okay)',function(done){
        var head = big_json.features[0].properties.header
        // I only want to print the data part right now
        var dumpdata = big_json.features[0].properties.data
        var out = fs.createWriteStream(file, { encoding: 'utf8' })
        json2csv({objectlist:dumpdata
                 ,header:head
                 ,outstream:out
                 ,encoding:'utf8'},function(e,d){
                                       //out.end()
        })
        out.on('finish',function(){
            fs.readFile(file,{encoding:'utf8'},function(err,data){
                var lines
                data.trim()
                lines = data.split(/\r?\n/)
                lines.length.should.eql(2837)
                lines.shift().should.eql('ts,freeway,n,hh,not_hh,o,avg_veh_spd,avg_hh_weight,avg_hh_axles,avg_hh_spd,avg_nh_weight,avg_nh_axles,avg_nh_spd,miles,lane_miles,detector_count,detectors')  // eslint-disable-line max-len
                lines.shift().should.eql('2007-01-01 00:00,22,57371.51,2955.49,3035.88,0.027083,69.73,39.12,4.99,60.04,12.95,2.05,61.87,1.45,4.34,24,0')  // eslint-disable-line max-len
                return done()
            })
            return null
        })
    })

})
