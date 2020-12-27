var mongoose = require("mongoose");
var productschema = new mongoose.Schema({
    productid: String,
    name: String,
    invoiceno: Number,
    date: String,
    cost: Number,
    usedby: String,
    purpose: String,
    workingcondition: String,
    usedfor: String

});

module.exports = mongoose.model("products", productschema);