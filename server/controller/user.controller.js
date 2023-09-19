const{UserModel}=require('../model/User.model.js')
const bcrypt=require('bcrypt')
// const mongoose = require("mongoose")
const emailValidator=require('email-validator')
const JWT = require("jsonwebtoken")
// const e = require("express")

//to register
exports.userSignUp=async(req,res)=>{
    const validEmail=emailValidator.validate(req.body.email)
    if(!validEmail){
        return res.status(400).json({
            success:false,
            message:'Please provide a valid email id'
        })
    }
    try {
        const newUser=UserModel(req.body)
        const result= await newUser.save()
        res.status(200).send({
            msg:'SignUp Success'
        })
    } catch (error) {
        res.status(501).send({
            msg:error.message
        })
    }
}

//to login
exports.userLogin=async(req,res)=>{
    const {username,password}=req.body
    try {
        const getuserData=await UserModel.findOne({username})
        .select('+password')
        if(getuserData&&getuserData.username){
            const result=await bcrypt.compare(password,getuserData.password)
            getuserData.password=undefined
            if(result){
                const token=await getuserData.jwtToken()
                const cookieOption={
                    maxAge:24*60*60*1000,
                    httpOnly:true
                }
                res.cookie('token',token,cookieOption)
                res.status(200).json({
                    success:true,
                    data:getuserData
                })
            }else{
                res.status(404).send({
                    msg:'Password is Incorrect, Try Again'
                })
            }
        }else{
            res.status(404).send({
                ms:'No account found associated with this username'
            })
        }
    } catch (error) {
        res.status(501).send({
            msg:error.message
        })
    }
}

//user details
exports.getUserDetails=async(req,res)=>{
    const{id,username}=req.user

    try {
        const userData=await UserModel.findOne({username})
        res.status(200).send({
            msg:'Success',
            data:userData
        })
    } catch (error) {
        res.status(501).send({
            msg:error.message
        })
    }
}
