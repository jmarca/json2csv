// test extracting keys
var should = require('should')
var extract = require('../lib/extract_keys.js')
var write_row = require('../lib/write_row.js')

describe('extract keys',function(){
    it('should write out basic object',function(){
        var obj={'foo':1,
                 'bar':2,
                 'baz':3}
        var keys = extract(obj).sort()
        var result = write_row(keys)(obj)
        result.should.eql([2,3,1])
    })
    it('should figure out a nested object',function(){
        var obj={'foo':1,
                 'bar':{'foo':1,
                        'bar':2,
                        'baz':3},
                 'baz':3}
        var keys = extract(obj).sort()
        var result = write_row(keys)(obj)
        result.should.eql([2,3,1,3,1])
    })
    it('should figure out a nested array',function(){
        var obj={'foo':1,
                 'bar':[1,2,3,4,5,6,7],
                 'baz':3}
        var keys = extract(obj).sort()
        var result = write_row(keys)(obj)
        result.should.eql([1,2,3,4,5,6,7,3,1])
    })
    it('should figure out a nested object and array',function(){
        var obj={'foo':1,
                 'bar':{'foo':1,
                        'bar':[1,2,3,4,5,6,7],
                        'baz':3},
                 'baz':3}
        var keys = extract(obj).sort()
        var result = write_row(keys)(obj)
        result.should.eql([1,2,3,4,5,6,7,3,1,3,1])
    })
    it('should figure out a doubly nested object and array',function(){
        var obj={'foo':1,
                 'bar':{'foo':'barfoo',
                        'bar':{'foo':1,
                               'bar':[1,2,3,4,5,6,7],
                               'baz':3},
                        'baz':'barbaz'},
                 'baz':'baz'}
        var keys = extract(obj).sort()
        var result = write_row(keys)(obj)
        result.should.eql([1,2,3,4,5,6,7,3,1,'barbaz','barfoo','baz',1])
    })
})
