var arrayify=require('./arrayify.js')
var stringify = require('csv-stringify')
var dump_header = require('./dump_header.js')
var extract = require('./extract_keys.js')

/**
 * Convert object list to CSV stream
 * @param {Object} options
 * @param {external:stream.Writable} options.outstream the output stream
 * @param {Object} options.header the header information...what to dump out
 *                 and in what order
 * @param {Array} options.objectlist the list of objects to dump.
 * Each object in the list should be identical, or at the very least
 * contain elements that map to the passed in header
 * @param {string} options.encoding the encoding to stream out, defaults to utf8
 * @param {streamCSVcallback} callback
 * @returns {} nothing
 * @throws {Error} if input values are missing, will throw Errors, and if the stream throws, this throws
 */
function streamCSV(options,callback){
    var stream = options.outstream
    var header = options.header
    var objlist = options.objectlist
    var encoding = options.encoding
    var stringifier
    var keys

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
    stringifier = stringify()
    stringifier.pipe(stream)

    // make it an array

    if( ! Array.isArray(objlist) ){
        objlist = [objlist]
    }

    // if there is no header, don't bother handling it
    if( header !== undefined ){
        dump_header(header)(stringifier)
    }

    // now dump the data
    keys = extract(objlist[0],true ) // sort keys by default

    // decide whether to do numeric or alpha sort()


    arrayify(objlist,keys,stringifier,encoding,function(e,d){
        stringifier.end() // close my stringifier
        return callback(e,d)
    })

}

module.exports=streamCSV


/**
 * An object implementing the stream writable interface
 * @external stream.Writable
 * @see {@link https://nodejs.org/dist/latest-v5.x/docs/api/stream.html#stream_class_stream_writable|Stream Writable}
 */



/**
 * A function to handle the results of the object to stream dumping
 * @callback streamCSVcallback
 * @param {?(Error|string)} error  null or the error or a message.  if null all went well
 * @param {?string} d probably nothing
 */
