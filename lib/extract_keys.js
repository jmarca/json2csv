
/**
 * extract keys from an object, and optionally sort them
 *
 * This function makes some attempt to recurse down into the object,
 * but it doesn't really recurse at the moment.  It merely dives in
 * two deep.  So if a particular key's value is another object, then
 * it will generate a bunch of sub-keys with the top level key, a dot,
 * and then the lower level keys.
 *
 * @param {Object} o the object in question
 * @param {Boolean} sort whether or not to sort the keys
 * @param {Object[]} header an optional header object
 * @returns {Array} an array of keys from the object.
 * @private
 */
function extract_keys(o,sort,header){
    // have an object, get out all of the keys, recursively
    var keys = Object.keys(o)
    var keyhash = []
    var useString

    // handle whether header is passed in, or sort, or both

    if(header === undefined){
        // check if sort is perhaps an object
        if (Array.isArray(sort)){
            // looks like it is
            header = sort
            sort = true
        }
    }

    if(header){
        // don't bother going through data, just dump header
        keyhash = header.filter(function(entry){
            return !entry.skip
        })
        keyhash = keyhash.sort(function(a,b){
            var compare = a.order - b.order
            var ahead,bhead
            if(compare === 0){
                // sort by alpha
                ahead = a.header || a.key
                bhead = b.header || b.head
                if(ahead < bhead) compare = -1
                if(ahead > bhead) compare = 1
            }
            return compare
        })
        keyhash = keyhash.map(function(entry){
            return entry.key
        })
    } else {

        // step through each value.  If it has an array or an object,
        // extract

        keys.forEach(function(key){
            var value = o[key]
            var secondary_keys
            var i,j
            if( Array.isArray(value) ){
                j = value.length
                for ( i=0; i<j; i++){
                    // store the key and index
                    keyhash.push(key+'.'+i)
                    // bug if a key has . in it!
                }
                return null
            }else{
                if( typeof value === 'object' ){
                    secondary_keys = extract_keys(value)
                    secondary_keys.forEach(function(k2){
                        // store the key and the sub key
                        keyhash.push(key+ '.'+k2)
                        // bug if a key has . in it!
                        return null
                    })
                    return null
                }

            }
            keyhash.push(key)
            return null
        })
        if(sort){
            // decide whether to do numeric or alpha sort()
            useString = keyhash.some(function(k){
                return isNaN(Number(k))
            })
            if(useString){
                keyhash = keyhash.sort()
            }else{
                keyhash = keyhash.sort(function(a, b) {
                    return a - b
                })
            }

        }
    }
    return keyhash
}
module.exports = extract_keys
