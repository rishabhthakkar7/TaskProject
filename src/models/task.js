const mongoose = require('mongoose')


const taskSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    description:{
        type:String,
        trim:true,
        required:true
    },
    status:{
        type:String,
        enum:['scheduled','running','expired'],
        default:'scheduled'
    },
    startTime:{
        type:Date
    },
    endTime:{
        type:Date,
    }
})

taskSchema.methods.toJSON = function(){
    const task = this
    const taskObject = task.toObject()

    delete taskObject.startTime
    delete taskObject.endTime

    return taskObject
}

taskSchema.pre('validate',async function(next) {
    if(!this.startTime && this.endTime){
        this.invalidate('startTime','Please enter StartTime');
    }else if (this.startTime > this.endTime) {
        this.invalidate('endTime','End Date must be greater than Start Date');
    } else {
        next();
    }
});

const Task = mongoose.model('Task',taskSchema)


module.exports = Task