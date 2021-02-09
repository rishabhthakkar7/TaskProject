const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async (req,res,next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decodetoken = jwt.verify(token,'nodeproject')
        const user = await User.findOne({ '_id':decodetoken._id,'tokens.token':token })
        if(!user){
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    }catch(e){
        res.send(401).send({'error':'Please Authenticate'})
    }
}

module.exports = auth