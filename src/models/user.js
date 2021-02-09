const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Please enter valid email')
            }
        }
    },
    age:{
        type:Number,
        default:0
    },
    password:{
        type:String,
        trim:true,
        required:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

UserSchema.statics.findByCredentials = async (email,password) =>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

UserSchema.methods.generateToken = async function(){
    const user = this
    const token = jwt.sign({ _id:user._id.toString() },'nodeproject')
    user.tokens = user.tokens.concat({ token })
    await user.save() 
    return token   
}

//Hash the palin text password before saving
UserSchema.pre('save',async function(next){
    const user = this
    
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    console.log('just before saving')
    next()
})

const User = mongoose.model('User',UserSchema)

module.exports = User