function dump_header(keys){
    var once = false
    return function(writer,cb){
        if(!once){
            once = true
            writer.write(keys,'utf8',cb)
        }else{
            cb()
        }
        return once
    }
}
module.exports=dump_header
