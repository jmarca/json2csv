var write_row = require('./write_row.js')

var arrayify = function(objlist,keys,writer,encoding,callback){

    //
    // logic borrowed from node.js api documentation on respecting
    // back pressure
    //

    var make_row = write_row(keys)
    var i = 0
    var j = objlist.length
    write()
    function write(){
        var ok=true
        do {
            i+=1
            if(i===j){
                // last time!
                console.log('last time')
                writer.write(make_row(objlist[i-1]),encoding,callback)
            }else{
                // continue or wait
                ok=writer.write(make_row(objlist[i-1]),encoding)
            }

        }while(i<j && ok)
        if(i<j){
            // had to stop early to wait for writer
            // write some more once it drains
            console.log('backpressure, i='+i)
            writer.once('drain',write)
        }
    }
}


module.exports=arrayify
