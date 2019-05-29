const express = require('express');
const mysql = require('mysql');
const app = express();
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
const session = require('express-session');

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
    //__dirname : It will resolve to your project folder.
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
  if(username && password){
    if(username == "shafaqat" && password == "12345") {
      console.log("successfully login");
      req.session.loggedIn = true;
      //res.cookie("loggedIn",true);
      res.redirect('/home');
    }else{
      res.end("user name or password is inncorrect");
    }
    
  } else {
    res.send("please Enter the username and password");
    res.end();
  }
});

app.use('/', router);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.listen(8000);
