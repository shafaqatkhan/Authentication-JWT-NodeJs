const express = require('express');
const mysql = require('mysql');
const app = express();
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
const session = require('express-session');

let jwt = require('jsonwebtoken');
const config = require('./config.js');

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

var urlencoded = bodyParser.urlencoded({ extended: false });
router.get('/',function(req,res){
  if(req.session.loggedIn){
    res.redirect ('/home');
  } else {
    console.log("main page"  + req);
    res.sendFile(path.join(__dirname+'/index.html'));
  }
});

router.get('/home',function(req,res){
  if(req.session.loggedIn){
    console.log("This is home page"  + req);
    res.sendFile(path.join(__dirname+'/home.html'));
  }else {
    res.send("please login to view this page");
    res.end();
  }
})

router.get('/about', (req,res) => {
  if(req.session.loggedIn){
    res.send("You are at About Page");
    res.end();
  }else {
    res.send("please login to view this page");
    res.end();
  };
});


router.get('/contact', (req,res) => {
  if(req.session.loggedIn){
    res.send("You are at Contact Page");
    res.end();
  }else {
    res.send("please login to view this page");
    res.end();
  };
});


router.get('/logout', (req,res) => {
  req.session.destroy();
  res.redirect('/');
});

router.post('/auth',urlencoded,function(req,res){
  console.log("Authenticate user login id and password");
  var username = req.body.username;
  var password = req.body.password;

  let user = "shafaqat";
  let pass = 00000;

  if(username && password){
    if(username == user && password == pass) {
      console.log("successfully login");
      req.session.loggedIn = true;
      //res.cookie("loggedIn",true);

      let token = jwt.sign({username: username},
        config.secret,
        { expiresIn: '24h' // expires in 24 hours
        }
      );
      // return the JWT token for the future API calls
      console.log("Token = " + token );
      // res.json({
      //   success: true,
      //   message: 'Authentication successful!',
      //   token: token
      // });

      res.redirect('/home');
    }else{
      res.end("your user name or password is inncorrect");
    }
    
  } else {
    res.send("please Enter the username and password");
    res.end();
  }
});

app.use('/', router);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function(req,res,next){
console.log("Express middlware called every time when http request gets call" + req.session.username);
next();
});

router.get('/checking', (req, res) => {
  res.json({
     "Tutorial": "Welcome to the Node express JWT Tutorial"
  });
});

app.listen(8000);
