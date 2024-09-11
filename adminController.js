const fs=require('fs')
const path=require('path')
const user=require('../models/user')
const { create } = require('domain')
const { useAutocomplete } = require('@mui/material')

exports.getSignUp=(req,res)=>{
    res.sendFile(path.join(__dirname,'../','views','SignUp.html'),(err)=>{console.log(err)})
}

exports.postSignUp=(req,res,next)=>{
    const username=req.body.name
    const mail=req.body.email
    const password=req.body.password

    user.create({
        username:username,
        E_mail:mail,
        password:password
    })
    .then(res=>{
        console.log(res)
        res.redirect('/login')
    }
    )
    .catch(err=>console.log(err))
}

exports.getLogin=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views','login.html'),(err)=>{console.log(err)})
}


exports.postLogin= async (req,res,next)=>{
    const username=req.body.name
    const password=req.body.password
    try{
        const User = await user.findOne({ username: username });

        if(!User){
            return res.status(404).json({ message: 'User not found' })
        }

        if (User.password !== password) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        res.status(200).json({ message: 'User Login successful' })

    }

    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
    
}