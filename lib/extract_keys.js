
function extract_keys(o){
    // have an object, get out all of the keys, recursively
    var keys = Object.keys(o)
    var keyhash = []
    // step through each value.  If it has an array or an object,
    // extract

    keys.forEach(function(key){
        var value = o[key]
        keyhash.push(key)
        if( typeof value === 'object' ){
            var secondary_keys = extract_keys(value)
            secondary_keys.forEach(function(k2){
                // store the key and the sub key
                keyhash.push[[key,k2].join('.')]
                // bug if a key has . in it!
                return null
            })
        }
        if( typeof value === 'array' ){
            var j = value.length;
            var pad = padder(j)
            for ( var i; i<j; i++){
                // store the key and index
                keyhash.push[[key,pad(i)].join('_')]
                // bug if a key has _ in it!
            }
        }

    })
    return keyhash
}

module.exports=extract_keys