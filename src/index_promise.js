const express=require('express')
require('./db/mongoose')
const User=require('./models/user')
const Tasks=require('./models/task')

const app=express()

const port=process.env.PORT || 3000

app.use(express.json())
app.post('/users',(req,res)=>
{
    const user= new User(req.body)
    user.save().then(()=>
    { 
     res.status(201).send(user)
    }).catch((error)=>
    {
        res.status(400).send(error)
    }) 

})

app.get('/users',(req,res)=>{

User.find({}).then((users)=>
{
res.send(users)
}).catch(()=>

{
res.status(500).send(error)
})

})

app.get('/users/:id',(req,res)=>{
 const _id=req.params.id
    if(_id.length!==24)
     {
     res.send('length should be 24')
     }
   User.findById(_id).then((user)=>
    {    
       if(!user)
        {
        return res.status(404).send('User not Found')
        }
       res.send(user)
    }).catch((error)=>{
          res.status(500).send(error)
          })

})


app.post('/tasks',(req,res)=>
{
    const task= new Tasks(req.body)
    task.save().then(()=>
    { 
     res.status(201).send(task)
    }).catch((error)=>
    {
        res.status(400)
.send(error)
    }) 

})


app.get('/tasks',(req,res)=>
{
  Tasks.find({}).then((tasks)=>
  {
      res.send(tasks)
  }) .catch((error) =>
  {
      res.send.status(500).send();
  })

})

app.get('/tasks/:id',(req,res)=>
{
  
    const _id= req.params.id

    if(_id.length!==24)
    {
      res.send('length is not 24')
    }


    Tasks.findById(_id).then((task)=>
    {  if(!task)
        {
       return res.status(404).send('No such Task found')
        }
        res.send(task)
    }).catch((error)=>
    {
        res.status(500).send()
    })

})


app.listen(port,()=>{
    console.log('server is up on port '+port)
})


// personal note:
// first this was an index.js file
// after changing in syntax putting this in index_promise.js and that in index.js
// to run this with nodemon go and change script property  
//"script" :{ start:"node/index_promise.js", "dev":"nodemon/index_promise.js"}
//in package.json and use nodemon run start command from terminal.