
var request = require('request');
var mongo = require('mongodb');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'Zoho',
  auth: {
    user: 'priyanshi1@zoho.com',
    pass: 'Piyush718!'
  },
  tls: {
    rejectUnauthorized: false
  }
});

var mailOptions = {
  from: 'priyanshi1@zoho.com',
  to: 'piyusman@gmail.com',
  subject: 'Sending Email for Payment',
  text: 'Hi'
};




module.exports = {
  getHomePage: (req, res) => {

    res.render('home.ejs');
  },

  getPaymentPage: (req, res) => {
    console.log(req.params.id);
    res.render('payment.ejs');
  },
  getGoogleMap:(req,res)=>{
    console.log('GoogleMap');
    res.render('login.ejs');
  },


  //refer
  postPaymentInfo: (req, res) => {
    console.log(req.body);
    var paymentInfo = {};
    console.log(req.body.firstname);
    paymentInfo.firstname = req.body.firstname;
    paymentInfo.email = req.body.email;
    paymentInfo.address = req.body.address;
    paymentInfo.city = req.body.city;
    paymentInfo.zipcode = req.body.zipcode;
    paymentInfo.membership = req.body.membership;
    console.log(JSON.stringify(paymentInfo));

    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("parking_lot");
      var myobj = paymentInfo;
      dbo.collection("payment").insertOne(myobj, function (err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        //Mail code
        mailOptions.to = paymentInfo.email + "; priyanshi.jajoo@sjsu.edu";
        mailOptions.subject = "Congratulations!!!Registered as Customer";
        mailOptions.html = "Hi <b>" + paymentInfo.firstname + "</b>, " + "<br /> <br /> You are registered as our customer . <br/><br /> Regards, <br /> CMPE-272";
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Sending success email ' + info.response);
          }
        });

        db.close();
      });
    });



    //React or angular
            request.post({
                url: 'http://localhost:5000/payment',
                body: JSON.stringify(clientpayInfo),
                headers: {
                    'Content-type': 'application/json'
                  }
            } , function (error, response, body) {
                console.log('error:', error); // Print the error if one occurred
                console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
                console.log('body:', body); // Print the HTML for the Google homepage.
            });
    res.render('success.ejs');
  }


}
