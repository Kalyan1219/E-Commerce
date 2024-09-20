const fs=require('fs')
const path=require('path')
const user=require('../models/user')
const { create } = require('domain')
const { useAutocomplete } = require('@mui/material')
const bcrypt=require('bcrypt')
const expenses = require('../models/expense')
const { Description, Category } = require('@mui/icons-material')


//LOADING SIGNUP PAGE FRONTEND
exports.getSignUp=(req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','SignUp.html'),(err)=>{console.log(err)})
}


// SIGNUP PAGE POST ( SAVING USER DETAILS IN DATABASE)
exports.postSignUp=(req,res,next)=>{
    const username=req.body.name
    const mail=req.body.email
    const password=req.body.password
    const saltRounds=1
    bcrypt.hash(password,saltRounds,async(err,hash)=>{
        user.create({
            username:username,
            E_mail:mail,
            password:hash
        })
    })
    res.redirect('/login')
}

exports.getLogin=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views','login.html'),(err)=>{console.log(err)})
}


// LOGIN PAGE POST REQUEST AND PASSWORD CHECKING

exports.postLogin = async (req, res, next) => {
    const username = req.body.name;
    const password = req.body.password;
  
    try {
      // Find the user by username
      const User = await user.findOne({ username: username });
  
      if (!User) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Compare the entered password with the stored hashed password
      console.log(User.password)
      console.log(password)
      bcrypt.compare(password, User.password, (err, result) => {
        if (err) {
          return next(err);  // Call next to pass the error to error-handling middleware
        }
  
        if (!result) {
          // Password does not match
          return res.status(401).json({ message: 'Incorrect password' });
        }

        if(result){
          res.redirect('/firstPage')
        }
        
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
      next(error);
    }
  };
  

// LOADING OF EXPENSE PAGE  FRONTEND
exports.getFirstPage=(req,res)=>{
  res.sendFile(path.join(__dirname,'../','views','firstPage.html'),(err)=>console.log(err))
}


// EXPENSE PAGE STORING EXPENSES IN DATABASE
exports.postExpense=(req,res)=>{
  const price=req.body.price
  const description=req.body.description
  const category=req.body.category
  //CAPITAL LEFT SIDE ARE FROM DATABASE & RIGHT SIDE ARE FROM HTML
  expenses.create({
    Price:price,
    Description:description,
    Category:category
  })
  res.redirect('/firstPage')
}


exports.getExpenses=async(req,res,next)=>{
  try{
    const expenses = await expenses.findAll()
    res.json(expenses);
  }catch(err){
    console.log(err)
  }
}