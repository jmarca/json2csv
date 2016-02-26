function pad1(width,char){
    if(char === undefined) char = '0'
    function pad(v){
        var i
        var padding = ''
        for(i = v.toString().length;
            i<width;
            i++){
            padding += char
        }
        return padding+v
    }
    return pad
}

//
// Note, I tested this and it is slower than the above by a lot. It
// looks pretty, but it is twice as slow (10000 elements done in 17ms
// vs 9ms for the above routine)
//
// function pad2 (width,char) {
//     if(char === undefined) char = '0'
//     return function(s){
//         return Array(Math.max(0, width - s.toString().length + 1)).join('0') + s;
//     }
// }


module.exports = pad1
//exports.pad2 = pad2
