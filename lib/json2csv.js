var arrayify=require('./arrayify.js')
var stringify = require('csv-stringify');
var dump_header = require('./dump_header.js')
var extract = require('./extract_keys.js')

function streamCSV(options,callback){
    var stream = options.outstream
    var header = options.header
    var objlist = options.objectlist
    var encoding = options.encoding

    if(encoding === undefined) encoding = 'utf8'

    // if there is no stream, die
    if(stream === undefined){
        throw new Error('options.outstream is required')
    }

    // if there is no object, die
    if(objlist === undefined){
        throw new Error('options.objectlist is required')
    }

    // connect CSV stringifier to the output writer
    var stringifier = stringify()
    stringifier.pipe(stream)

    // make it an array

    if( ! Array.isArray(objlist) ){
        console.log('make it an array')
        objlist = [objlist]
    }

    // if there is no header, don't bother handling it
    if( header !== undefined ){
        dump_header(header)(stringifier)
    }

    // now dump the data
    var keys = extract(objlist[0])

    // decide whether to do numeric or alpha sort()

    var useString = keys.some(function(k){
                        return isNaN(Number(k))
                    })
    if(useString){
        keys = keys.sort()
    }

    arrayify(objlist,keys,stringifier,encoding,function(e,d){
        stringifier.end() // close my stringifier
        return callback(e,d)
    })

}

module.exports=streamCSV