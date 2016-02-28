/*eslint-env node, mocha */

var fs =  require('fs')
var filenum = 0
var p = require('../lib/streaming_json_parser.js')

var should = require('should')

describe('big object dump',function(){

    var file = 'other_json_output'+filenum+'.csv'
    filenum++
    after(function(done){
        fs.unlink(file,done)
    })

    it('dumpeth json okay',function(done){
        var collector
        var is_header = false
        var is_data = false
        var outputstream = fs.createWriteStream(file,{'encoding':'utf8'})
        var opts = {
            'outstream':outputstream
            ,'write_header':true
            ,'inputfile':'./test/files/oldway.json'
            ,'encoding':'utf8'
            ,'docid':'oldway.json'
        }

        p(opts,function(e,lines){
            should.not.exist(e)
            fs.readFile(file,{encoding:'utf8'},function(err,data){
                var l
                data.trim()
                l = data.split(/\r?\n/)
                l.length.should.eql(lines+1) // adds an empty line at the end
                l.shift().should.eql('idx,docid,ts,road_class,vmt,lane_miles,single_unit_mt,combination_mt')

                return done()
            })

        })

    })

})
