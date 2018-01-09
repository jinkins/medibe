var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = 8080; 


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});

var userRoutes = require('./routes/users');
app.use('/user', userRoutes);

var connectionsRoutes = require('./routes/connections');
app.use('/connections', connectionsRoutes);

var suppliersRoutes = require('./routes/suppliers');
app.use('/suppliers', suppliersRoutes);


app.listen(port, function(){
    console.log('app running on port %d', port);
});