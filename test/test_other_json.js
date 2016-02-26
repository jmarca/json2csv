/*eslint-env node, mocha */
// test extracting keys

var fs =  require('fs')
var filenum = 0

var clarinet = require('clarinet')
var stringify = require('csv-stringify')
require('should')

describe('big object dump',function(){

    var file = 'other_json_output'+filenum+'.csv'
    filenum++
    after(function(done){
        fs.unlink(file,done)
    })

    it('extract header and data ',function(done){
        var collector
        var is_header = false
        var is_data = false
        var error = false
        var lines = 0
        var parser = clarinet.createStream()
        var inputstream = fs.createReadStream('./test/files/oldway.json',
                                              {'encoding':'utf8'})
        var outputstream = fs.createWriteStream(file,
                                               {'encoding':'utf8'})

        var stringifier = stringify()
        stringifier.pipe(outputstream)

        parser.on('error', function (e) {
            // an error happened. e is the error.
            error = true
            return null
        })

        parser.on('key', function (key) {
            // got some value.  v is the value. can be string, double, bool, or null.
            console.log('got ', key)
            if(key === 'header'){
                is_header = true
            }
            if(key==='data'){
                is_data = true
            }
            return null
        })

        parser.on('value',function(value){
            if(is_header || is_data){
                collector.push(value)
            }
        })

        parser.on('openarray',function(value){
            if(is_header || is_data){
                collector = []
            }
        })

        parser.on('closearray',function(value){
            if(is_header || is_data){
                stringifier.write(collector)
                lines++
            }
        })

        parser.on('closeobject' , function () {
            // closed an object.
            is_header = false
            is_data = false
        })
        inputstream.on('end',function(){
            console.log('inputstream end')
            //parser.end()
        })
        inputstream.on('finish',function(){
            console.log('inputstream finish')
            //parser.end()
        })
        parser.on('end',function(){
            console.log('parser end')
            stringifier.end()
        })

        parser.on('finish',function(){
            console.log('parser finish')
            //stringifier.end()
        })


        stringifier.on('end',function(){
            console.log('stringifier end')
        })

        stringifier.on('finish',function(){
            console.log('stringifier finish')
        })

        outputstream.on('end',function(){
            console.log('got outputstream end')
        })

        outputstream.on('finish',function(){
            console.log('output finish')
            outputstream.close()
            fs.readFile(file,{encoding:'utf8'},function(err,data){
                var l
                data.trim()
                l = data.split(/\r?\n/)
                l.length.should.eql(lines+1) // adds an empty line at the end
                l.shift().should.eql('ts,road_class,vmt,lane_miles,single_unit_mt,combination_mt')
                error.should.be.false()

                return done()
            })

        })
        inputstream.pipe(parser)

        return done
    })

})
