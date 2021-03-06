const express = require('express')
const router = new express.Router()
const User =  require("../models/user")
const auth = require('../middleware/auth')

router.post('/users',async (req,res)=>{
    const user = new User(req.body)

    try{
        await user.save()
        const token = await user.generateToken()
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/user/login',async (req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateToken()
        res.send({user,token})
    }catch(e){
        res.status(400).send(e)
    }   
})

router.delete('/users/:id',async(req,res)=>{
    try{
        const _id = req.params.id
        const user = await User.findByIdAndDelete(_id)

        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router