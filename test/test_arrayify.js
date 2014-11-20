// test extracting keys
var should = require('should')
var arrayify = require('../lib/arrayify.js')
var stringify = require('csv-stringify')
var dump_header = require('../lib/dump_header.js')
var fs =  require('fs')
var file = 'output.csv'

var extract = require('../lib/extract_keys.js')

// after(function(done){
//     //fs.unlink(file,done)
// })
var filenum = 0
describe('basic object dump',function(){
    var file = 'dump'+filenum+'.txt'
    filenum++
    after(function(done){
        fs.unlink(file,done)
    })
    it('should write out basic object',function(done){
        var head = ['foo','bar','baz']
        var obj=[]
        for(var i=0;i<10;i++){
            var row = {}
            head.forEach(function(k){
                row[k]=i
                return null
            })
            obj.push(row)
        }
        var keys = extract(obj[0]).sort()
        var stringifier = stringify()
        var out = fs.createWriteStream(file, { encoding: 'utf8' })
        stringifier.pipe(out)
        dump_header(keys)(stringifier)

        arrayify(obj,keys,stringifier,'utf8',function(e,d){
            stringifier.end()
        })
        stringifier.on('finish',function(){
            out.end()
        })
        out.on('finish',function(){
            fs.readFile(file,{encoding:'utf8'},function(err,data){
                data.trim()
                var lines = data.split(/\r?\n/);
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

describe('big object dump',function(){
    var file = 'dump'+filenum+'.txt'
    filenum++
    after(function(done){
        fs.unlink(file,done)
    })
    var big_json
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
        var keys = extract(dumpdata[0])
        var stringifier = stringify()
        var out = fs.createWriteStream(file, { encoding: 'utf8' })
        stringifier.pipe(out)
        dump_header(head)(stringifier)

        arrayify(dumpdata,keys,stringifier,'utf8',function(e,d){
            stringifier.end()
        })
        out.on('finish',function(){
            fs.readFile(file,{encoding:'utf8'},function(err,data){
                data.trim()
                var lines = data.split(/\r?\n/);
                lines.should.have.length(2837)
                lines.shift().should.eql("ts,freeway,n,hh,not_hh,o,avg_veh_spd,avg_hh_weight,avg_hh_axles,avg_hh_spd,avg_nh_weight,avg_nh_axles,avg_nh_spd,miles,lane_miles,detector_count,detectors")
                lines.shift().should.eql("2007-01-01 00:00,22,57371.51,2955.49,3035.88,0.027083,69.73,39.12,4.99,60.04,12.95,2.05,61.87,1.45,4.34,24,0")
                return done()
            })
            return null
        })
    })

})
