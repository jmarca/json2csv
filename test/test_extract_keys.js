// test extracting keys
var should = require('should')
var extract = require('../lib/extract_keys.js')

describe('extract keys',function(){
    it('should figure out basic object',function(){
        var obj={'foo':1,
                 'bar':2,
                 'baz':3}
        extract(obj).should.eql(['foo','bar','baz'])
    })
    it('should figure out a nested object',function(){
        var obj={'foo':1,
                 'bar':{'foo':1,
                        'bar':2,
                        'baz':3},
                 'baz':3}
        extract(obj).should.eql(['foo',
                                 'bar.foo',
                                 'bar.bar',
                                 'bar.baz',
                                 'baz'])
    })
    it('should figure out a nested array',function(){
        var obj={'foo':1,
                 'bar':[1,2,3,4,5,6,7],
                 'baz':3}
        extract(obj).should.eql(['foo',
                                 'bar.0',
                                 'bar.1',
                                 'bar.2',
                                 'bar.3',
                                 'bar.4',
                                 'bar.5',
                                 'bar.6',
                                 'baz'])
    })
    it('should figure out a nested object and array',function(){
        var obj={'foo':1,
                 'bar':{'foo':1,
                        'bar':[1,2,3,4,5,6,7],
                        'baz':3},
                 'baz':3}
        extract(obj).should.eql(['foo',
                                 'bar.foo',
                                 'bar.bar.0',
                                 'bar.bar.1',
                                 'bar.bar.2',
                                 'bar.bar.3',
                                 'bar.bar.4',
                                 'bar.bar.5',
                                 'bar.bar.6',
                                 'bar.baz',
                                 'baz'])
    })
})
