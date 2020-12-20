var mongoose = require("mongoose");
var bodyparser = require("body-parser");
var express = require("express");
var app = express();
var multer = require('multer');
var path = require('path')
var fs = require('fs');
let alert = require("alert");
var methodOverride = require('method-override');
var passportlocalmongoose = require("passport-local-mongoose");
const { Db, ObjectID } = require("mongodb");

//scheema
var employee = require("./models/employee");
const product = require("./models/product");
const { listeners } = require("process");
const { db, find } = require("./models/employee");

//mongoose connect

mongoose.connect("mongodb://localhost:27017/productDB", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });

//use
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));

//multer middleware

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({
    storage: storage
});
//////login
app.get("/login", function(req, res) {
    res.render("login");
});

app.post("/login", function(req, res) {
        var email = req.body.email;
        var password = req.body.password;
        if (email == "karthikeyan@gmail.com" && password == "1234567") {
            alert("successfully loged in")
            res.redirect("/product")
        } else {
            alert("email or password is wrong");
            res.redirect("/login");
        }
    })
    ////logout

app.get("/logout", function(req, res) {
    res.render("logout");
})

//add employee

app.get("/", function(req, res) {
    res.redirect("/login");
});

app.get("/addemployee", function(req, res) {
    res.render('addemployee');
});


app.post("/addemployee", upload.single('image'), function(req, res, next) {
    var employeeid = req.body.employeeid;
    var name = req.body.employeename;
    var email = req.body.email;
    var phonenumber = req.body.phonenumber;

    var img = fs.readFileSync(req.file.path);
    var encode_img = img.toString('base64');
    // var finalresult = {
    //     employeeid: employeeid,
    //     name: name,
    //     email: email,
    //     phonenumber: phonenumber,
    //     contenttype: req.file.mimetype,
    //     path: req.file.path,
    //     image: new Buffer.from(encode_img, 'base64')
    // };
    db.collection('employee').findOne({ employeeid: employeeid }, function(err, employee) {

        if (employee) {
            alert("employee already exist");
            res.redirect("/addemployee");
        } else {
            db.collection('employee').insertOne({
                    employeeid: employeeid,
                    name: name,
                    email: email,
                    phonenumber: phonenumber,
                    contenttype: req.file.mimetype,
                    path: req.file.path,
                    image: new Buffer.from(encode_img, 'base64')
                },
                function(err, employee) {
                    alert("employee added successfully");
                    res.redirect("/product");



                })
        }
    })




})

app.get("/addproduct", function(req, res) {
    db.collection('employee').find().toArray(function(err, employee) {
        res.render("addproduct", {
            employee: employee
        });
    })

})

app.post("/addproduct", function(req, res) {
    var productid = req.body.productid;
    var name = req.body.productname;
    var invoiceno = req.body.invoiceno;
    var cost = req.body.cost;
    var date = req.body.date;
    var usedby = req.body.usedby;
    var purpose = req.body.purpose;
    var workingcondition = req.body.workingcondition;
    var usedfor = req.body.usedfor;
    product.create({
        productid: productid,
        name: name,
        invoiceno: invoiceno,
        date: date,
        cost: cost,
        usedfor: usedfor,
        usedby: usedby,
        purpose: purpose,
        workingcondition: workingcondition
    });
    alert("product added successfully");
    res.redirect("/product");
});

//


app.get("/product", function(req, res) {
    var pageize = 3;

    db.collection('products').find().limit(pageize).toArray(function(err, product) {
        console.log(product);
        if (err) {
            console.log(err)
        } else {
            res.render("product", { product: product });
        }
    })

})

//////
//////////////////////////////
app.get("/product/:start/:limit", function(req, res) {

    db.collection("products").find().skip(parseInt(req.params.start)).limit(parseInt(req.params.limit)).toArray(function(err, product) {
        res.send(product)
    })
})



///pagination
// app.get("/getproduct/:start/:limit", function(req, res) {

//     product.find().sort({ "_id": -1 }).skip(parseInt(req.params.start)).limit(parseInt(req.params.limit)).toArray(function(err, product) {
//         res.send(product)
//     })
// })


///////functions

//////edit product

app.get("/:id/edit", function(req, res) {
    console.log(req.params.id);
    db.collection('products').findOne({
            "_id": new mongoose.Types.ObjectId(req.params.id)
        },
        function(err, product) {
            // console.log("product");
            // console.log(product)
            res.render("edit", { product: product })
        })

})


app.put("/:id", function(req, res) {
    var productid = req.body.productid;
    var name = req.body.productname;
    var invoiceno = req.body.invoiceno;
    var cost = req.body.cost;
    var date = req.body.date;
    var usedby = req.body.usedby;
    var usedfor = req.body.usedfor;
    var purpose = req.body.purpose;
    var workingcondition = req.body.workingcondition;
    console.log("from put  requsest");
    console.log(name);
    db.collection('products').findOneAndReplace({
            "_id": new mongoose.Types.ObjectId(req.params.id)
        }, {
            productid: productid,
            name: name,
            invoiceno: invoiceno,
            date: date,
            cost: cost,
            usedby: usedby,
            usedfor: usedfor,
            purpose: purpose,
            workingcondition: workingcondition
        },
        function(err, updateproduct) {
            console.log(updateproduct);
            res.redirect("/product");
        })

})


app.listen(8080, function() {
    console.log("we are in server");
})