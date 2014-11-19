
var stringify = require('csv-stringify');
var dump_header = require('./dump_header.js')
var extract_keys = require('./extract_keys.js')
var pad = require('./pad.js')

// basically, the steps for JSON to CSV is to first figure out the
// structure of the JSON with the call to extract keys, then spit out
// one row of CSV for each row of JSON


// step one, parse the keys from the first row of data, and cross your
// fingers that they are all the same


function write_row(keys){
    // for each key, split on the periods, then find and write the
    // output
    var split_keys = []
    keys.forEach(function(k){
        split_keys.push(k.split('.'))
        return null
    })
    return function(obj){
        var result=[]
        split_keys.forEach(function(sk){
            var v=obj[sk.shift()]
            while(sk.length){
                v = v[sk.shift()]
            }
            result.push(v)
        })
        return result
    }
}
module.exports=write_row
