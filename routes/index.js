
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

  getPlanPage: (req, res) => {

    res.render('plan.ejs');
  },

  getPaymentPage: (req, res) => {
    console.log(req.params.id);
    res.render('payment.ejs');
  },
  getGoogleMap:(req,res)=>{
    res.render('login.ejs');
  },
  getSpots:(req,res)=>{
    res.render('spots.ejs');
  },

  getSpotsStatus:(req,res)=>{

    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("parking_lot");
      //var myobj = paymentInfo;
     
      dbo.collection("parkingSlots").find({}).toArray(function(err, result) {
        if (err) throw err;
        //console.log(result);
        var data =[];
        for(var i=0;i<result.length;i++){
          var allSlots={};
          allSlots.status=result[i].isSlotFull;
          allSlots.slot = result[i].slot_num;
          allSlots.slot_type = result[i].slot_type;
          data.push(allSlots);
        }
        //Mail code
        // mailOptions.to = paymentInfo.email + "; priyanshi.jajoo@sjsu.edu";
        // mailOptions.subject = "Congratulations!!!Registered as Customer";
        // mailOptions.html = "Hi <b>" + paymentInfo.firstname + "</b>, " + "<br /> <br /> You are registered as our customer . <br/><br /> Regards, <br /> CMPE-272";
        // transporter.sendMail(mailOptions, function (error, info) {
        //   if (error) {
        //     console.log(error);
        //   } else {
        //     console.log('Sending success email ' + info.response);
        //   }
        // });

        db.close();
        console.log(data);
        res.send(data);
        
        return;
      });
    });
    
  },
  getVehicle:(req,res)=>{
    res.render('cardemo.ejs');
  },

  getEmptySpot:(req,res)=>{
    var type = req.params.type;
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("parking_lot");
      //var myobj = paymentInfo;
      var query = { slot_type: type,isSlotFull:false };
      dbo.collection("parkingSlots").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        var data =[];
        if(result == [] || result == undefined){
          db.close();
          return res.send("Sorry Parking Full");
        } else {
          db.close();
        return res.send("Please go to Slot no: <b>" + result[0].slot_num + "</b> on " + result[0].block_code + " on floor " + result[0].floor_no);
        }
      
       
        //
        
      });
    });
  },


emailEmptySpot: (req,res)=>{
  var customerInfo={};
  console.log(req.body);
  customerInfo.email = req.body.email;
  customerInfo.vehiclenumber=req.body.vehicle;
  customerInfo.type=req.body.type;
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("parking_lot");
    var query = { slot_type: customerInfo.type ,isSlotFull:false };
    dbo.collection("parkingSlots").find(query).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      // var data =[];
      if(result == [] || result == undefined){
       
        mailOptions.to = customerInfo.email + "; priyanshi.jajoo@sjsu.edu";
        mailOptions.subject = "Registered!!!";
        mailOptions.html = "Hi <b>" + "Sorry Parking Full" + "</b>, " + "<br /> <br /> Regards, <br /> CMPE-273";
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Sending success email ' + info.response);
          }
          db.close();
        });

        return res.send('home.ejs');
      } 
      else {
        
        mailOptions.to = customerInfo.email + "; priyanshi.jajoo@sjsu.edu";
        mailOptions.subject = "Registered!!!";
        mailOptions.html = "Hi <b>" + "Please go to Slot no: <b>" + result[0].slot_num + "</b> on " + result[0].block_code + " on floor " + result[0].floor_no + "</b>, " + "<br /> <br /> You are registered as our customer . <br/><br /> Regards, <br /> CMPE-273";
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log('Sending success email ' + info.response);
          }
          db.close();
        });

      return res.send('home.ejs');
      }
      
    });
  });
  //console.log(JSON.stringify(paymentInfo));

      
      
  
  // MongoClient.connect(url, function (err, db) {
  //   if (err) throw err;
  //   var dbo = db.db("customer");
  //   var myobj =customerInfo ;
  //   dbo.collection("customerDetails").insertOne(myobj, function (err, res) {
  //     if (err) throw err;
  //     // console.log(result);
  //     mailOptions.to = customerInfo.email + "; priyanshi.jajoo@sjsu.edu";
  //     mailOptions.subject = "Registered!!!";
  //     mailOptions.html = "Hi <b>" + customerInfo.fullname + "</b>, " + "<br /> <br /> You are registered as our customer . <br/><br /> Regards, <br /> CMPE-272";
  //     transporter.sendMail(mailOptions, function (error, info) {
  //       if (error) {
  //         console.log(error);
  //       } else {
  //         console.log('Sending success email ' + info.response);
  //       }
  //     });
  //     // // var data =[];
  //     // if(result == [] || result == undefined){
  //     //   db.close();
  //     //   return res.render("home.ejs");
  //     // } else {
  //     //   db.close();
  //     // return res.send("Please go to Slot no: <b>" + result[0].slot_num + "</b> on " + result[0].block_code + " on floor " + result[0].floor_no);
  //     // }
  //   });
  // });
    
},
  getAllSpots: (req,res)=>{

    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("parking_lot");
      //var myobj = paymentInfo;
      var query = { isSlotFull:false };
      dbo.collection("parkingSlots").find(query).toArray(function(err, result) {
        if (err) throw err;
        //console.log(result);
        var data={};
        data.carcount=0;
        data.bikecount=0;
        data.truckcount=0;
        for(var i=0;i<result.length;i++){
          if(result[i].slot_type == 'bike'){
            data.bikecount++;
        } else if(result[i].slot_type == 'car'){
          data.carcount++;
        } else if(result[i].slot_type == 'truck'){
          data.truckcount++;
        }
        }
        //Mail code
        // mailOptions.to = paymentInfo.email + "; priyanshi.jajoo@sjsu.edu";
        // mailOptions.subject = "Congratulations!!!Registered as Customer";
        // mailOptions.html = "Hi <b>" + paymentInfo.firstname + "</b>, " + "<br /> <br /> You are registered as our customer . <br/><br /> Regards, <br /> CMPE-272";
        // transporter.sendMail(mailOptions, function (error, info) {
        //   if (error) {
        //     console.log(error);
        //   } else {
        //     console.log('Sending success email ' + info.response);
        //   }
        // });

        db.close();
        console.log(data);
        res.send(data);
        
        return;
      });
    });
    
  },
  parkSpot:(req,res)=>{
    var type = req.params.type;
    console.log(type);
    var myquery = { slot_num: type };
    var newvalues = { $set: { isSlotFull:true} };
    console.log(newvalues);
    //var myquery = { slot_num: type };
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("parking_lot");
      //var myobj = paymentInfo;
      var query = { slot_type: type,isSlotFull:false };
      dbo.collection("parkingSlots").updateOne(myquery, newvalues, function(err, result) {
        if (err) throw err;
        console.timeLog(result);
        console.log("1 document updated");
        db.close();
       
      });
      return res.send("Successfully Parked");
    });
  },
  leaveSpot:(req,res)=>{
    var type = req.params.type;
    console.log(type);
    var myquery = { slot_num: type };
    var newvalues = { $set: { isSlotFull:false} };
    console.log(newvalues);
    MongoClient.connect(url, function (err, db) {
      if (err) throw err;
      var dbo = db.db("parking_lot");
      //var myobj = paymentInfo;
      //var query = { slot_type: type,isSlotFull:false };
      dbo.collection("parkingSlots").updateOne(myquery, newvalues, function(err, result) {
        if (err) throw err;
        console.log("1 document updated");
        db.close();
        return res.send("Succcess");
      });
      
    });
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
