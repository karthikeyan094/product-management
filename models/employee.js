var mongoose = require("mongoose");
var passportlocalmongoose = require("passport-local-mongoose");
var employeeschema = new mongoose.Schema({

    employeeid: {
        type: String,
        unique: true
    },
    name: String,
    email: String,
    phonenumber: String,
    contenttype: String,
    path: String,
    image: String


});
employeeschema.plugin(passportlocalmongoose);
module.exports = mongoose.model("employee", employeeschema);