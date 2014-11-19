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
