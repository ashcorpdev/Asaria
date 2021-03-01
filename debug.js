var date = new Date();
const fs = require('fs');

module.exports = {
    debug(string, boolean) {
        var d = `${date.getDay()}/${date.getMonth()+1}/${date.getFullYear()}`;
        var h = String(date.getHours()).padStart(2, "0");
        var m = String(date.getMinutes()).padStart(2, "0");
        var s = String(date.getSeconds()).padStart(2, "0");

        let output = `[${d} - ${h}:${m}:${s}] ${string}`
        let path = (__dirname, "./bundles/asaria/debug.log")
        //Sends output to console
        console.log(output)

        if(boolean == true){
        //Writes output to log file.
        fs.appendFileSync(path, output+"\n")
        }

    }
}