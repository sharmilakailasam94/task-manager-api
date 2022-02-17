const express=require('express')
require('./db/mongoose')
const User=require('./models/user')
const Tasks=require('./models/task')
const userRouter=require('./router/user')
const taskRouter=require('./router/task')

const app=express()

const port=process.env.PORT || 3000


/* app.use((req,res,next)=>
{
    if(req.method==='GET')
    {
        res.send('GET Requests are Disabled')
    }
    else{
        next()
    }
    
})
 */
/* app.use((req,res,next)=>{

    res.status(503).send('The Site is Temporarily unavailable due to Maintainance')

})
 */

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port,()=>{
    console.log('server is up on port '+port)
})

const multer = require('multer')
const upload = multer({
    dest:'images',
    limits:
    {
        fileSize:1000000
    },
    fileFilter(req,file,cb)
    {
          if(!file.originalname.match(/\.(doc|docx)$/))
        //if(!file.originalname.endsWith('.pdf'))
        {return cb(new Error('Please upload a word document'))

        }
          cb(undefined,true)

      /*  cb(new Error('File must be a PDF'))
       cb(undefined,true)
       cb(undefined,false)
 */    }
})


app.post('/uploads',upload.single('upload'),(req,res)=>
{
      res.send()
},(error,req,res,next)=>
{
    res.status(400).send({error:error.message})
})







/* const Task = require('./models/task')
const User1=require('./models/user')
 */
/*const main = async()=>
{



     const task=await Task.findById('62061c2a63ceb24d8a0c5bce')
    await task.populate([{ path :'owner'}])   // or replace Simply with await task.populate('owner')
    console.log(task.owner)
 
/* const user = await User.findById('62061989a7ddc4d0ab60f944')
await user.populate([{ path:'tasks'}])
console.log(user.tasks)


}
main() */


/* const pet={
    "name":"tommy"
}

pet.toJSON=function()
{
console.log(this)
return this
}
console.log(JSON.stringify(pet))
 */

/* const jwt=require('jsonwebtoken')
const myFunction =async()=>
{
    const token=jwt.sign({ _id:'abcd1234567812345678asdf'},'thisismynewcourse')
     console.log(token)
     const data = jwt.verify(token,'thisismynewcourse')
     console.log(data)

    }   

myFunction()
 */


/*const bcrypt= require('bcrypt')
myfunction=async()=>
{
    const password ='er21234'
    const hashedPassword=await bcrypt.hash(password,8)

console.log(password)
console.log(hashedPassword)

    const isMatch= await bcrypt.compare('vhgvhgv',hashedPassword)
    console.log(isMatch)


}

myfunction() */