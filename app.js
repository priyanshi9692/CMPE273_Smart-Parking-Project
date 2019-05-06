const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();


//Imports to route
 const {getHomePage} = require('./routes/index');
 const {getPaymentPage} = require('./routes/index');
 const {getGoogleMap} = require('./routes/index');
const {postPaymentInfo}= require('./routes/index');

/* Set up values */
const port = 5000;
// configure middleware
app.set('port', process.env.port || port); 
app.set('views', __dirname + '/views'); 
app.set('view engine', 'ejs'); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(fileUpload());

/* Set up values End */


// routes for our app
app.get('/', getHomePage);
app.get('/payment', getPaymentPage);
app.get('/GoogleMap', getGoogleMap);
app.post('/paymentInfo', postPaymentInfo);




// set the app to listen on the port
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});