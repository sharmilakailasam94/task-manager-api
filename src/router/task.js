const express = require('express')
const Tasks=require('../models/task')
const auth=require('../middleware/auth')
const router= new express.Router()

router.post('/tasks',auth,async(req,res)=>
{
    //const task= new Tasks(req.body)
    const task = new Tasks({
      ...req.body,
      owner:req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }
    catch(error)
    {
        res.sendStatus(400).send()
    }

})

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=20
router.get('/tasks',auth,async(req,res)=>
{
   const match = {}
   const sort ={}
  if(req.query.completed)
  {
    match.completed=req.query.completed==='true'
  }
  
  if(req.query.sortBy)
  {
    const parts = req.query.sortBy.split(':') // we can use any special character instead of : eg _ or someother we can use
    sort[parts[0]]=parts[1]==='desc'?-1:1
  }

  try{
    //const tasks= await Tasks.find({owner:req.user._id})
      //or using populate does the same work
    // we know that we have a users profile of authenticted user from auth file 
    // we can get the user by using req.user
      await req.user.populate([
        {
          path:'tasks',
          match,
          options:{
            limit:parseInt(req.query.limit),
            skip:parseInt(req.query.skip),
            sort
          }
        }])  
      //user is req.user
      // populated using user.populate({path}) path is virtual field tasks we set in user's model
       res.send(req.user.tasks)
  }
  catch(e){
     res.status(500).send()
  }

})

router.get('/tasks/:id',auth,async(req,res)=>
{
    const _id = req.params.id
  
   /* if(_id.length!==24)
   {
      return res.status(404).send('Length is not 24.')
   } */
   try{
   const task=await Tasks.findOne({_id,owner:req.user.id})
   if(!task)
   {
     return res.status(404).send('No task found.')
   }
   res.send(task)

}
   catch(error)
{
  res.status(500).send(error)
}
    
})

router.patch('/tasks/:id',auth,async(req,res)=>
{  

  /* const _id=req.params.id
      if(_id.length!=24)
      {
       return res.status(404).send('Length of the id should of 24 char exactly.')
      } */
      const updates=Object.keys(req.body)
     allowedUpdates=['description','completed']
    
     isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
    

      //  in the above line used short-hand arrow function 
      if(!isValidOperation)
      {
        return res.status(400).send('Invalid updates!')
      }  

        try {
       const task= await Tasks.findOne({_id:req.params.id,owner:req.user._id})
         //const task= await Tasks.findById(req.params.id)
        
         if(!task)
         {
            return  res.status(404).send('Task not found')
         }

         updates.forEach((update)=>task[update]=req.body[update])
         await task.save()
         res.send(task)

         }
     catch(error)
       {
             res.status(400).send(error)
       }

})

router.delete('/tasks/:id',auth,async(req,res)=>
{


 /* if(req.params.id.length!==24)
 {
   return res.status(400).send('Invalid Length for id.')
 }
 */
 try
 {
   const task= await Tasks.findOneAndDelete({_id:req.params.id,owner:req.user._id})
   if(!task)
   {
     return res.status(404).send('No task found to delete.')
   }
   res.send(task)
 }
  catch(error)
  {
    res.status(500).send(error.message)
  }


})

module.exports=router