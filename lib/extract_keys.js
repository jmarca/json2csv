//var pad=require('./pad.js')

function extract_keys(o,sort){
    // have an object, get out all of the keys, recursively
    var keys = Object.keys(o)
    var keyhash = []
    // step through each value.  If it has an array or an object,
    // extract

    keys.forEach(function(key){
        var value = o[key]
        if( typeof value === 'object' ){
            var secondary_keys = extract_keys(value)
            secondary_keys.forEach(function(k2){
                // store the key and the sub key
                keyhash.push(key+ '.'+k2)
                // bug if a key has . in it!
                return null
            })
            return null
        }
        if( typeof value === 'array' ){
            var j = value.length;
            for ( var i; i<j; i++){
                // store the key and index
                keyhash.push(key+'.'+i)
                // bug if a key has . in it!
            }
            return null
        }
        keyhash.push(key)
        return null
    })
    if(sort){
        // decide whether to do numeric or alpha sort()

        var useString = keys.some(function(k){
                            return isNaN(Number(k))
                        })
        if(useString){
            keys = keys.sort()
        }else{
            keys = keys.sort(function(a, b) {
                       return a - b;
                   })
        }

    }
    return keyhash
}
module.exports = extract_keys