const express = require("express");
const body_parser = require("body-parser");
const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs')
const User = require('./model/user');
const jwt = require('jsonwebtoken');
//const connectDB = require('./model/connection');
const URI ="mongodb+srv://user1:<password>@cluster0.tsoml.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&ssl=true";


const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#*(&@*!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk'

console.log(mongoose.connect('mongodb+srv://user1:<password>@cluster0.tsoml.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}));

var loggedIn=0;
var led=0;


const app = express();

app.use(express.static("public"));
app.use(body_parser.urlencoded({
  extended: true
}));

app.get("/", function(req, res){
  res.sendFile(__dirname + "/login/index.html");

})

app.get("/home",function(req,res){
  if(loggedIn){
    return res.sendFile(__dirname+"/layout/layout.html");
  }
  else{
    return res.redirect('/');
  }
});

app.post("/home",function(req,res){
  if(req.body.submit === 'on'){
    led=1;
  }
  else{
    led=0;
  }
  return res.redirect('/home');
})

app.get("/update",function(req,res){
  if(led==0){
    return res.json({light: 'off'});
  }
  else{
    return res.json({light: 'on'});
  }
});

app.post("/", async (req, res) => {
  if (req.body.submit === 'Log In') {
    //log in operations
    // res.send("login successful");
    const {
      username,
      password
    } = req.body
    const user = await User.findOne({
      username: username
    }).lean()

    //console.log(user.password);

    if (!user) {
      return res.json({
        status: 'error',
        error: 'You have not registered yet.'
      })
    }

    if ((password === user.password)) {
      // the username, password combination is successful

      const token = jwt.sign({
          id: user._id,
          username: user.username
        },
        JWT_SECRET
      )
      loggedIn=1;
      return res.redirect('home');
    }

    res.json({
      status: 'error',
      error: 'Invalid username/password'
    })
  } else {
    //register operations
    const {
      username,
      userid,
      email,
      password,
      'confirm-password': plainTextPassword
    } = req.body

    if (!username || typeof username !== 'string') {
      return res.json({
        status: 'error',
        error: 'Invalid username'
      })
    }

    if (!plainTextPassword || typeof plainTextPassword !== 'string') {
      return res.json({
        status: 'error',
        error: 'Invalid password'
      })
    }

    if (plainTextPassword.length < 5) {
      return res.json({
        status: 'error',
        error: 'Password too small. Should be atleast 6 characters'
      })
    }

    const password1 = await bcrypt.hash(plainTextPassword, 10);

    try {
      const response = User.create({
        username,
        password
      })
      console.log('User created successfully: ', response)
    } catch (error) {
      if (error.code === 11000) {
        // duplicate key
        return res.json({
          status: 'error',
          error: 'Username already in use'
        })
      }
      throw error
    }

    res.json({
      status: 'ok'
    })
  }
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running");
})
