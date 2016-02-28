var fs = require('fs')
var clarinet = require('clarinet')
var stringify = require('csv-stringify')

/**
 * Use clarinet streaming JSON parser to dump json as csv
 *
 * the document is a loose adherent to geojson spec
 *
 * {"features":[],"type":"FeatureCollection","sumup":true,"docid":"..."}
 *
 * the features array tends to be a single element:
 *
 * [
 * {"document":"the url path",
 *  "header":["array","of","strings","detectors"],
 *  "data":[
 *           [ ...  a data row  ... ],
 *               ...  ,
 *           [ ...  a data row  ... ]
 *         ]
 * }
 * ]
 *
 * detectors column might be zero, might be a lot of columns.
 *
 * alternately, for hpms data it comes from couchdb, so you will see
 *
 * {"_id":"county_ALAMEDA_2009",
 *  "_rev":"4-3e919ee62ad4a26037ea64ceec3fbdfe",
 *  "area_type":"county",
 *  "area_name":"ALAMEDA",
 *  "year":2009,
 *  "header":["ts","road_class","vmt","lane_miles",
 *            "single_unit_mt","combination_mt"],
 *  "data":[["2009-01-01 00:00",
 *           "Rural Principal Arterial Interstate (PAI)",
 *           16528.975824133267452,63.572711043457921676,491.07699345447770156,1122.3477135664741127],
 *          ["2009-01-01 00:00","Rural Other Principal A"...],
 *          ...
 *          ]
 *  "grid_cells":["132_164",...]
 * }
 *
 * so this parser is a state machine.  If in data, then
 * process rows of data.  if in grid_cells, process rows of
 * grid cells.  if in header, process a single header row.
 *
 *
 * @param {Object} opts
 * @param {external:stream.Writable} opts.outstream the output stream
 * @param {Object} opts.header the header information...what to dump out
 *                 and in what order
 * @param {Object} opts.write_header whether or not to write out a
 *                 header row.  defaults to true
 * @param {string} opts.inputfile the JSON file to read and stream
 * @param {string} opts.encoding the encoding to stream out, defaults to utf8
 * @param {string} opts.docid optional.  The document id.  defaults to
 *    the inputfile name, opts.inputfile.  this will be written out to
 *    the output file on each row.
 * @param {streamCSVcallback} callback
 * @returns {} nothing
 * @throws {Error} if input values are missing, will throw Errors, and
 *     if the stream throws, this throws
 * @param {} cb
 * @returns {}
 */
function clarinet_parser(opts,cb){

    var collector,h_collector
    var is_header = false
    var is_data = false
    var is_grid_cells = false
    var error = false
    var is_data_rows = false
    var is_data_row = false
    var lines = 0
    var column = 0
    var parser = clarinet.createStream()
    var stringifier = stringify()
    var outputstream = opts.outstream
    var header = opts.header
    var header_lookup
    var write_header = opts.write_header
    var wrote_header = false
    var encoding = opts.encoding
    var inputstream
    var keys
    var idx = 1 // start counting data lines from 1
    var docid = opts.docid || opts.inputfile

    if(encoding === undefined) encoding = 'utf8'

    if(write_header === undefined){
        write_header = true
    }
    if(!write_header){
        wrote_header = true
    }


    // if there is no stream, die
    if(outputstream === undefined){
        throw new Error('options.outstream is required')
    }

    // if there is no object, die
    if(opts.inputfile === undefined){
        throw new Error('options.inputfile is required')
    }
    inputstream = fs.createReadStream(opts.inputfile,
                                      {'encoding':'utf8'})
    stringifier.pipe(outputstream)

    // reorganize passed in header if it exists for easier lookup
    if(header !== undefined){
        header_lookup = {}
        header.forEach(function(h){
            header_lookup[h.key] = h
            return null
        })
    }


    // set up the clarinet parser callbacks

    // conceptually, I have a number of columns.  One might be
    // detectors.  If so, handle it specially.  Then, because it is
    // known, process 'data' for keys, and process properties' for
    // detectors list.

    parser.on('error', function (e) {
        // an error happened. e is the error.
        error = true
        return null
    })

    parser.on('key', function (key) {
        // got some key for a key/value pair. if key is header or
        // data, flip those bits
        //
        // 'data' means that the value is an array of data, so below
        // we'll be diving into arrays.
        //
        // 'header' means that the value will be a list of strings for
        // the header for the data.  We need this to be able to
        // intelligently pick out what we want from the data values.
        // If we see header before data, all is good.  If we see data
        // before header, that is bad.
        //


        console.log('got ', key)
        if(key === 'header'){
            is_header = true
            is_data = false
            is_grid_cells = false
        }
        if(key==='data'){
            is_data = true
            is_header = false
            is_grid_cells = false
        }
        if(key === 'grid_cells' || key === 'detectors'){
            is_data = false
            is_header = false
            is_grid_cells = true
        }
        return null
    })

    parser.on('value',function(value){
        if(is_header ){
            // if we have a header object, test if we should use an alternate value
            if(header_lookup !== undefined
               && header_lookup[value] !== undefined
               && header_lookup[value].header !== undefined){
                h_collector.push(header_lookup[value].header)
            }else{
                h_collector.push(value)
            }

        }else{
            if( is_data_row || is_grid_cells){
                collector.push(value)
            }
        }
        column++
        return null
    })

    parser.on('openarray',function(value){
        column = 0
        if(is_header ){
            // initialize the row data with cumulative record index and document id
            if(header){
                h_collector=[]
                h_collector.push( header[0].header || header[0].key || 'idx')
                h_collector.push( header[1].header || header[1].key || 'docid')
            }else{
                h_collector = ['idx','docid']
            }
        }
        if(is_grid_cells){
            // initialize with a long blank row?
            collector = []
            header.forEach(function(h){
                // FIXME hard coding "detectors" and "grid_cells" here
                if(h.key !== 'detectors' && h.key !== 'grid_cells'){
                    collector.push('')
                }
                return null
            })
        }
        if(is_data){
            // two cases.  first comes the opening of the big data
            // array.  second comes the opening of a single data row.
            if(! is_data_rows ){
                is_data_rows = true
            }else{
                is_data_row = true
                collector = [idx,docid]
                idx++
            }
        }

        return null
    })

    parser.on('closearray',function(value){

        if(is_header) {
            // only write if requested
            if(write_header){
                stringifier.write(h_collector)
                wrote_header = true
                lines++
            }

            if(header === undefined){
                // no passed in header, so dummy one up
                header = []
                h_collector.forEach(function(h,i){
                    header.push({
                        'key':h
                        ,'order':i
                        ,'skip':false
                    })
                    return
                })
            }

        }
        if( is_grid_cells ){
            stringifier.write(collector)
            lines++
        }
        // data has two cases, first the big outer containing array,
        // second an individual row of data
        if(is_data){
            if(is_data_row){
                // don't write row data before header if I want to
                // also write the header
                if(!wrote_header){
                    console.log('did not yet write header')
                    // well, this is a fine mess.  we have data in the JSON file before we've seen the header row.  So we'll have to rely on the input header
                    h_collector = ['idx','docid']
                    header.forEach(function(h){
                        if(h.key !== 'detectors' && h.key !== 'grid_cells'){
                            var v = h.header || h.key
                            h_collector.push(v)
                        }
                        return null
                    })
                    // now write the header and make a note of it
                    stringifier.write(h_collector)
                    wrote_header = true
                    lines++
                }
                // write and close a single row of data
                stringifier.write(collector)
                lines++
                is_data_row = false
            }else{
                // not on a data row, so must be closing up the big array
                is_data_rows = false
                is_data = false
            }
        }

        return null
    })

    parser.on('closeobject' , function () {
        // closed an object.
        is_header = false
        is_data = false
        is_grid_cells = false
        return null
    })
    inputstream.on('end',function(){
        console.log('inputstream end')
        //parser.end()
        return null
    })
    inputstream.on('finish',function(){
        console.log('inputstream finish')
        //parser.end()
        return null
    })
    parser.on('end',function(){
        console.log('parser end')
        stringifier.end()
        return null
    })

    parser.on('finish',function(){
        console.log('parser finish')
        //stringifier.end()
        return null
    })


    stringifier.on('end',function(){
        console.log('stringifier end')
        return null
    })

    stringifier.on('finish',function(){
        console.log('stringifier finish')
        return null
    })

    outputstream.on('end',function(){
        console.log('got outputstream end')
        return null
    })

    outputstream.on('finish',function(){
        outputstream.close()
        return cb(null,lines)
    })
    inputstream.pipe(parser)
    return null
}

module.exports=clarinet_parser
