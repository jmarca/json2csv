

function buildCSV(options,cb){
    var header_row
    var column_names = options.columns ? options.columns : {}

    var default_header = options.default_header

    var total_data_idx = -1
    var writestream = options.writestream

    function write_something(docid, datacols){
        total_data_idx++
        writestream.write([total_data_idx,docid]
                              .concat(
                                  _.map(header_row
                                       ,function(k){
                                            return '';
                                        })
                              )
                         );
    }
    return function(err,doc){

        if (err){
            return cb(err);
        }



        var fcoll = JSON.parse(doc);


        var features = fcoll.features;
        var rows = 0;
        var datacols=[];
        var features_length = features.length;
        if(features_length){
            // header row
            datacols = features[0].properties.header;
        }
        if(!datacols || !datacols.length){
            // panic! look for properties header somewhere in data
            for (var i = 0; i < features_length; i++){
                if(features[i].properties !== undefined
                   && features[i].properties.header !== undefined ){
                    datacols = features[0].properties.header;
                    break;
                }
            }
        }
        if(header_row === undefined && (!datacols || !datacols.length)){
            // dump an error and return
                //console.log('no data for header available in document')
            if(default_header !== undefined){
                datacols = default_header
            }else{
                return cb(null);
            }
        }
        if(header_row === undefined){
            header_row =_.flatten( _.map(['i','document'].concat(datacols)
                                  ,function(key){
                                       return column_names[key] || key
                                   }))

            writestream.write(header_row)
            // for later usage
            header_row.shift()
            header_row.shift()
            //console.log(header_row)
        }


        // handle detectors special
        var detectors = datacols.pop()
        if(detectors !== 'detectors'){
            datacols.push(detectors)
            detectors = null
        }else{
            detectors = datacols.length
        }

        for (var i = 0; i < features_length; i++){
            var props = features[i].properties;
            var datalen = props.data.length;
            if(props.data !== undefined && Array.isArray(props.data) && datalen){
                for (var dataidx = 0; dataidx < datalen; dataidx++){
                    total_data_idx++
                    var width = props.data[dataidx].length
                    var entry = [total_data_idx,props.document]
                    entry = entry.concat(
                        datacols.map(function(key,idx){
                            if(props.data[dataidx] === undefined
                               || props.data[dataidx][idx] === undefined){
                                return '';
                            }else{
                                return props.data[dataidx][idx] ;
                            }
                        })
                    )
                    if(detectors){
                        //console.log('handle detectors, slice from '+detectors + ':'+width )
                        entry = entry.concat(
                            props.data[dataidx].slice(detectors,width)
                        )
                    }

                    writestream.write(entry)
                    rows++
                }
            }else{
                // no data
                write_something(fcoll.docid,datacols)
            }
        }
        if(!features_length){
            write_something(fcoll.docid,header_row)
        }
        return cb(null,rows)

    };
};
