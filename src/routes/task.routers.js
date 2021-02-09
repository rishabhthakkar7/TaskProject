const express =  require('express')
const router = new express.Router()
const Task = require("../models/task")
const auth = require('../middleware/auth')

router.post('/tasks',auth,async (req,res)=>{
    const task = new Task(req.body)
    try{
        await  task.save()
        res.status(201).send(task) 
    }catch(error){
        res.status(500).send(error)
    }
})

router.get('/tasks',auth,(req,res)=>{
    
    try{
        const $match={}
        const $sort= {}
        if(req.query.search){
            $match.name = req.query.search
        }

        //i have putted date filter statically here
        // if(req.query.date){
            $match.startTime = { $gte:new Date('2020-02-01'), $lt: new Date('2020-02-31') } 
        // }
        
        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            const allowedSortBy = ['name','startTime','endTime']
            if(allowedSortBy.includes(parts[0])){
                $sort[parts[0]] = ( parts[1] === 'desc')?-1:1;
            }else{
                $sort['_id'] = -1
            }
        }else{
            $sort['_id'] = -1
        }

        // const tasks = await Task.find({})
         Task.aggregate([{$match},{$sort}],function(err,tasks){
            res.send(tasks)
        });
    }catch(e){
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id',auth,async (req,res)=>{
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdate = ['name','status','description','startTime','endTime']
    const isValidOpration = updates.every((every)=>{
        return allowedUpdate.includes(every)
    })

    if(!isValidOpration){
        return res.status(400).send('Invalid Opration')
    }

    try{
        // const task = await Task.findByIdAndUpdate(_id,req.body,{new:true,runValidators:true})
        const task = await Task.findById(_id)
        if(!task){
            res.status(404).send()
        }

        updates.forEach((update)=>task[update]=req.body[update])
        task.save()

        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id',auth,async (req,res)=>{
    const _id = req.params.id
    try{
        const task = await Task.findByIdAndDelete(_id)

        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

module.exports = router