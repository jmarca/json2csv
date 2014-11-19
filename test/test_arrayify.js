// test extracting keys
var should = require('should')
var arrayify = require('../lib/arrayify.js')

describe('basic',function(){
    it('should write out basic object',function(){
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
        var result = arrayify(obj)
        result.should.eql([['bar','baz','foo'],
                           [0,0,0],
                           [1,1,1],
                           [2,2,2],
                           [3,3,3],
                           [4,4,4],
                           [5,5,5],
                           [6,6,6],
                           [7,7,7],
                           [8,8,8],
                           [9,9,9]
                          ]
                         )
    })
})
