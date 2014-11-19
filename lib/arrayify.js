var write_row = require('./write_row.js')
var extract = require('./extract_keys.js')
var dump_header = require('./dump_header.js')

var arrayify = function(objlist){
    var first = objlist[0]
    var header_row_keys = extract(first).sort()
    var writer = write_row(header_row_keys)
    var header_row_text = header_row_keys
    var result_rows = []
    result_rows.push(header_row_text)
    objlist.forEach(function(v){
        var row = writer(v)
        // console.log({'v':v,
        //              'row':row})
        result_rows.push(row)
        return null
    })
    return result_rows
}
module.exports=arrayify