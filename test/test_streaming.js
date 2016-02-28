/*eslint-env node, mocha */

var fs =  require('fs')
var filenum = 0
var p = require('../lib/streaming_json_parser.js')

var should = require('should')

describe('big object dump',function(){

    var file = 'other_json_output'+filenum+++'.csv'
    filenum++
    after(function(done){
        fs.unlink(file,done)
    })

    it('dumpeth json okay',function(done){
        var collector
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
                l.shift().should.eql('1,oldway.json,2009-01-01 00:00,Rural Principal Arterial Interstate (PAI),16528.975824133267,63.57271104345792,491.0769934544777,1122.347713566474')
                l.pop().should.eql('') // last line is blank
                // second to last line should equal the grid cells data
                l.pop().should.eql(',,,,,,,,132_164,133_163,133_164,133_165,133_166,134_162,134_163,134_164,134_165,134_166,135_161,135_162,135_163,135_164,136_159,136_160,136_161,136_162,136_163,137_156,137_159,137_160,137_161,137_162,137_163,138_156,138_157,138_158,138_159,138_160,138_161,138_162,139_155,139_156,139_157,139_158,139_159,139_160,139_161,139_162,140_155,140_156,140_157,140_158,140_161,141_155,141_156,141_157,141_158,141_159,141_160,141_161,142_157,142_158,142_159,142_160,142_161,143_158,143_159,143_160,143_161,144_159,144_160,144_161,144_162,145_159,145_160,145_161,145_162,146_158,146_159,146_160,146_161,147_160,147_161,147_162,148_162,148_163')

                return done()
            })

        })

    })
})
describe('different ways of invoking',function(){

    describe('no encoding',function(){
        var file = 'other_json_output'+ filenum +'.csv'
        filenum++
        after(function(done){
            fs.unlink(file,done)
        })

        it('defaults encoding',function(done){
            var collector
            var outputstream = fs.createWriteStream(file,{'encoding':'utf8'})
            var opts = {
                'outstream':outputstream
                ,'write_header':true
                ,'inputfile':'./test/files/smallfile.json'
                ,'docid':'small.json'
            }

            p(opts,function(e,lines){
                should.not.exist(e)
                fs.readFile(file,{encoding:'utf8'},function(err,data){
                    var l
                    data.trim()
                    l = data.split(/\r?\n/)
                    l.length.should.eql(lines+1) // adds an empty line at the end
                    l.shift().should.eql('idx,docid,ts,road_class,vmt,lane_miles,single_unit_mt,combination_mt')
                    l.shift().should.eql('1,small.json,2009-01-01 00:00,Rural Principal Arterial Interstate (PAI),16528.975824133267,63.57271104345792,491.0769934544777,1122.347713566474')
                    l.pop().should.eql('') // last line is blank
                    // second to last line should equal the grid cells data
                    l.pop().should.eql(',,,,,,,,132_164,133_163,133_164,133_165,133_166,134_162,134_163,134_164,134_165,134_166,135_161,135_162,135_163,135_164,136_159,136_160,136_161,136_162,136_163,137_156,137_159,137_160,137_161,137_162,137_163,138_156,138_157,138_158,138_159,138_160,138_161,138_162,139_155,139_156,139_157,139_158,139_159,139_160,139_161,139_162,140_155,140_156,140_157,140_158,140_161,141_155,141_156,141_157,141_158,141_159,141_160,141_161,142_157,142_158,142_159,142_160,142_161,143_158,143_159,143_160,143_161,144_159,144_160,144_161,144_162,145_159,145_160,145_161,145_162,146_158,146_159,146_160,146_161,147_160,147_161,147_162,148_162,148_163')

                    return done()
                })

            })

        })

    })
    describe('no write_header',function(){
        var file = 'other_json_output'+ filenum +'.csv'
        filenum++
        after(function(done){
            fs.unlink(file,done)
        })

        it('defaults encoding',function(done){
            var collector
            var outputstream = fs.createWriteStream(file,{'encoding':'utf8'})
            var opts = {
                'outstream':outputstream
                ,'inputfile':'./test/files/smallfile.json'
                ,'docid':'small.json'
            }

            p(opts,function(e,lines){
                should.not.exist(e)
                fs.readFile(file,{encoding:'utf8'},function(err,data){
                    var l
                    data.trim()
                    l = data.split(/\r?\n/)
                    l.length.should.eql(lines+1) // adds an empty line at the end
                    l.shift().should.eql('idx,docid,ts,road_class,vmt,lane_miles,single_unit_mt,combination_mt')
                    l.shift().should.eql('1,small.json,2009-01-01 00:00,Rural Principal Arterial Interstate (PAI),16528.975824133267,63.57271104345792,491.0769934544777,1122.347713566474')
                    l.pop().should.eql('') // last line is blank
                    // second to last line should equal the grid cells data
                    l.pop().should.eql(',,,,,,,,132_164,133_163,133_164,133_165,133_166,134_162,134_163,134_164,134_165,134_166,135_161,135_162,135_163,135_164,136_159,136_160,136_161,136_162,136_163,137_156,137_159,137_160,137_161,137_162,137_163,138_156,138_157,138_158,138_159,138_160,138_161,138_162,139_155,139_156,139_157,139_158,139_159,139_160,139_161,139_162,140_155,140_156,140_157,140_158,140_161,141_155,141_156,141_157,141_158,141_159,141_160,141_161,142_157,142_158,142_159,142_160,142_161,143_158,143_159,143_160,143_161,144_159,144_160,144_161,144_162,145_159,145_160,145_161,145_162,146_158,146_159,146_160,146_161,147_160,147_161,147_162,148_162,148_163')

                    return done()
                })

            })

        })

    })
    describe('write_header is false',function(){
        var file = 'other_json_output'+ filenum +'.csv'
        filenum++
        after(function(done){
            fs.unlink(file,done)
        })

        it('does not dump header',function(done){
            var collector
            var outputstream = fs.createWriteStream(file,{'encoding':'utf8'})
            var opts = {
                'outstream':outputstream
                ,'inputfile':'./test/files/smallfile.json'
                ,'write_header':false
                ,'docid':'small.json'
            }

            p(opts,function(e,lines){
                should.not.exist(e)
                fs.readFile(file,{encoding:'utf8'},function(err,data){
                    var l
                    data.trim()
                    l = data.split(/\r?\n/)
                    l.length.should.eql(lines+1) // adds an empty line at the end
                    // first line is not header but data
                    l.shift().should.eql('1,small.json,2009-01-01 00:00,Rural Principal Arterial Interstate (PAI),16528.975824133267,63.57271104345792,491.0769934544777,1122.347713566474')
                    l.pop().should.eql('') // last line is blank
                    // second to last line should equal the grid cells data
                    l.pop().should.eql(',,,,,,,,132_164,133_163,133_164,133_165,133_166,134_162,134_163,134_164,134_165,134_166,135_161,135_162,135_163,135_164,136_159,136_160,136_161,136_162,136_163,137_156,137_159,137_160,137_161,137_162,137_163,138_156,138_157,138_158,138_159,138_160,138_161,138_162,139_155,139_156,139_157,139_158,139_159,139_160,139_161,139_162,140_155,140_156,140_157,140_158,140_161,141_155,141_156,141_157,141_158,141_159,141_160,141_161,142_157,142_158,142_159,142_160,142_161,143_158,143_159,143_160,143_161,144_159,144_160,144_161,144_162,145_159,145_160,145_161,145_162,146_158,146_159,146_160,146_161,147_160,147_161,147_162,148_162,148_163')

                    return done()
                })

            })

        })

    })
    describe('no docid defined',function(){
        var file = 'other_json_output'+ filenum +'.csv'
        filenum++
        after(function(done){
            fs.unlink(file,done)
        })

        it('uses input file name for doc id in output',function(done){
            var collector
            var outputstream = fs.createWriteStream(file,{'encoding':'utf8'})
            var opts = {
                'outstream':outputstream
                ,'inputfile':'./test/files/smallfile.json'
                ,'write_header':false
            }

            p(opts,function(e,lines){
                should.not.exist(e)
                fs.readFile(file,{encoding:'utf8'},function(err,data){
                    var l
                    data.trim()
                    l = data.split(/\r?\n/)
                    l.length.should.eql(lines+1) // adds an empty line at the end
                    // first line is not header but data
                    l.shift().should.eql('1,./test/files/smallfile.json,2009-01-01 00:00,Rural Principal Arterial Interstate (PAI),16528.975824133267,63.57271104345792,491.0769934544777,1122.347713566474')
                    l.pop().should.eql('') // last line is blank
                    // second to last line should equal the grid cells data
                    l.pop().should.eql(',,,,,,,,132_164,133_163,133_164,133_165,133_166,134_162,134_163,134_164,134_165,134_166,135_161,135_162,135_163,135_164,136_159,136_160,136_161,136_162,136_163,137_156,137_159,137_160,137_161,137_162,137_163,138_156,138_157,138_158,138_159,138_160,138_161,138_162,139_155,139_156,139_157,139_158,139_159,139_160,139_161,139_162,140_155,140_156,140_157,140_158,140_161,141_155,141_156,141_157,141_158,141_159,141_160,141_161,142_157,142_158,142_159,142_160,142_161,143_158,143_159,143_160,143_161,144_159,144_160,144_161,144_162,145_159,145_160,145_161,145_162,146_158,146_159,146_160,146_161,147_160,147_161,147_162,148_162,148_163')

                    return done()
                })

            })

        })

    })

    describe('alternative header defined',function(){
        var file = 'other_json_output'+ filenum +'.csv'
        filenum++
        after(function(done){
            fs.unlink(file,done)
        })

        it('uses input file name for doc id in output',function(done){
            var collector
            var outputstream = fs.createWriteStream(file,{'encoding':'utf8'})
            var header = [
                {'key':'index'}
                ,{'key':'filename'}
                ,{'key':'ts','header':'timestamp'}
                ,{'key':'road_class'}
                ,{'key':'vmt','header':'vehicle miles traveled'}
                ,{'key':'lane_miles'}
                ,{'key':'single_unit_mt'}
                ,{'key':'combination_mt'}
            ]
            header.forEach(function(h,i){
                h.skip = false
                h.order = i
                return null
            })

            var opts = {
                'outstream':outputstream
                ,'inputfile':'./test/files/smallfile.json'
                ,'write_header':true
                ,'header':header
            }

            p(opts,function(e,lines){
                should.not.exist(e)
                fs.readFile(file,{encoding:'utf8'},function(err,data){
                    var l
                    data.trim()
                    l = data.split(/\r?\n/)
                    l.length.should.eql(lines+1) // adds an empty line at the end
                    l.shift().should.eql('index,filename,timestamp,road_class,vehicle miles traveled,lane_miles,single_unit_mt,combination_mt')
                    l.shift().should.eql('1,./test/files/smallfile.json,2009-01-01 00:00,Rural Principal Arterial Interstate (PAI),16528.975824133267,63.57271104345792,491.0769934544777,1122.347713566474')
                    l.pop().should.eql('') // last line is blank
                    // second to last line should equal the grid cells data
                    l.pop().should.eql(',,,,,,,,132_164,133_163,133_164,133_165,133_166,134_162,134_163,134_164,134_165,134_166,135_161,135_162,135_163,135_164,136_159,136_160,136_161,136_162,136_163,137_156,137_159,137_160,137_161,137_162,137_163,138_156,138_157,138_158,138_159,138_160,138_161,138_162,139_155,139_156,139_157,139_158,139_159,139_160,139_161,139_162,140_155,140_156,140_157,140_158,140_161,141_155,141_156,141_157,141_158,141_159,141_160,141_161,142_157,142_158,142_159,142_160,142_161,143_158,143_159,143_160,143_161,144_159,144_160,144_161,144_162,145_159,145_160,145_161,145_162,146_158,146_159,146_160,146_161,147_160,147_161,147_162,148_162,148_163')

                    return done()
                })

            })

        })

    })
})
