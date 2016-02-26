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
        var result=
            split_keys.map(function(sk){
                return sk.reduce(function(previous,current,i,a){
                    return previous[current]
                },obj)
            })
        return result
    }
}
module.exports=write_row
