/*eslint-env node, mocha */
// test padding a string

var dump_header = require('../lib/dump_header.js')
var fs = require('fs')
//var csv = require('csv')
//var csv_writer = csv.stringify()
var stringify = require('csv-stringify')
var file = 'header.csv'

require('should')

after(function(done){
    fs.unlink(file,done)
})
describe('dump_header',function(){
    it('should dump the header, only once',function(done){
        var dumper,header,stringifier,out

        header = ['foo',
                      'bar.foo',
                      'bar.bar.foo',
                      'bar.bar.bar.0',
                      'bar.bar.bar.1',
                      'bar.bar.bar.2',
                      'bar.bar.bar.3',
                      'bar.bar.bar.4',
                      'bar.bar.bar.5',
                      'bar.bar.bar.6',
                      'bar.bar.baz',
                      'bar.baz',
                      'baz']
        stringifier = stringify()
        out = fs.createWriteStream(file, { encoding: 'utf8' })
        stringifier.pipe(out)

        dumper = dump_header(header)
        dumper(stringifier,function(){
            dumper(stringifier,function(){
                // should have only written the first
                //stringifier.end()
                out.end()
                return null
            })
            return null
        })
        stringifier.on('finish', function() {
            out.end()
            return null
        })
        out.on('finish',function(){
            // load the file, make sure
            fs.readFile(file,{encoding:'utf8'},function(err,data){
                data.should.eql('foo,bar.foo,bar.bar.foo,bar.bar.bar.0,bar.bar.bar.1,bar.bar.bar.2,bar.bar.bar.3,bar.bar.bar.4,bar.bar.bar.5,bar.bar.bar.6,bar.bar.baz,bar.baz,baz\n') // eslint-disable-line max-len
                return done()
            })
            return null
        })
        return null

    })
})
