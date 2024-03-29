const express=require('express')
const multer=require('multer')
const sharp=require('sharp')
const router=new express.Router()
const User=require('../models/user')
const auth=require('../middleware/auth')
const {sendWelcomeEmail,sendCancelEmail}=require('../email/account')
const ObjectId = require('mongoose').Types.ObjectId;

router.post('/users',async(req,res)=>
{
    const user= new User(req.body)
    
    try{
      await user.save()
       sendWelcomeEmail(user.email,user.name) 
      const token=await user.generateAuthToken()
    res.status(201).send({user,token})
    }
    catch(error){
     res.status(400).send(error)
    }

})

router.post('/users/login',async(req,res)=>
{
  try{
  const user=await User.findByCredentials(req.body.email,req.body.password)
  const token = await user.generateAuthToken()
  res.send({user,token})
  }
  catch(error)
  {
    res.status(400).send(error.message)
  }

})

router.post('/users/logout',auth,async(req,res)=>
{
  try{

req.user.tokens=req.user.tokens.filter((token)=>
{
  return token.token!== req.token
})
    await req.user.save()
    res.send()
  }
  catch(error)
  {
    res.status(500).send(error.message)
  }

})

router.post('/users/logoutall',auth,async(req,res)=>
{
  try{
  req.user.tokens=[]
  await req.user.save()
  res.send()

}
  catch(error)
  {
   res.status(500).send(errror.message)
  }

})



router.get('/users/me',auth,async(req,res)=>{

    res.send(req.user)

})

/*router.get('/users/:id',async(req,res)=>{ 
     const _id=req.params.id
      if(_id.length!=24)
      {
      return res.status(404).send('Length of the id should of 24 char exactly.')
      }
        try{
            const user= await User.findById(_id) 
            if(!user)     
            {
                 return res.status(404).send('No user found.')
            }
            res.send(user)
        }
        catch(error)
        {
             res.status(500).send()
        }
    

}) */

router.patch('/users/me',auth,async(req,res)=>
{    
  
   /*  const _id= req.params.id
    

     if(_id.length!=24)
     {
     return res.status(500).send('Length is not 24.')
     } */
  
  const updates=Object.keys(req.body)
     allowedPropertyNames=['name','email','password','age']
     isValidOperation=updates.every((update)=>allowedPropertyNames.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error:'Invalid updates!'})
    }

     try{
     //const user= await User.findByIdAndUpdate(req.params.id,req.body,{new : true,runValidators:true})

     //const user= await User.findById(req.user._id)
     updates.forEach((update)=> req.user[update]=req.body[update])
     // update is not a property of user object so we are not accessing it using . intstead accesing it 
     // using user[update]---> not a property in user model object but it is defined in this particular patch lock
     // we accesing it explicitly using user[update]
     await req.user.save()
     // middleware going to execute before the above line. 


     /* if(!user)
     {
        return res.status(404).send('User not found.')
     } */
     res.send(req.user)
     }
    catch(error)
    {
    res.status(500).send(error.message)
    }
})

router.delete('/users/me',auth,async(req,res)=>
{
 /* isTrue=ObjectId.isValid(req.user._id)
if(!isTrue )
    return res.status(400).send('Length should be of 24 char or hex value.')
 */

try{
  /* const user=await User.findByIdAndDelete(req.user._id)
  if(!user)
  {
    return res.status(404).send('No user found to delete.')
  }
   */
  await req.user.remove()
  sendCancelEmail(req.user.email,req.user.name) 

  res.send(req.user)
}
catch(error)
{
  res.status(500).send(error)
}


})

const upload=multer({
  limits:{
    fileSize:1000000
  },
  fileFilter(req,file,cb)
  {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
    {
      cb(new Error('please upload a valid image format'))
    }
      cb(undefined,true)
  }
})

router.post('/users/me/avatar',auth,upload.single('avatar'),async(req,res)=>
{
  const buffer= await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
  req.user.avatar=buffer
  //req.user.avatar=req.file.buffer
   await req.user.save()
  res.send('profile picture uploaded sucessfully')
},(error,req,res,next)=>
{
  res.status(400).send({error:error.message})
})

router.delete('/users/me/avatar',auth,async(req,res)=>
{
req.user.avatar=undefined
await req.user.save()
res.send('Profile picture deleted')
})

router.get('/users/:id/avatar',async (req,res)=>
{
  try{
    const user= await User.findById(req.params.id)
if(!user || !user.avatar)
{
  throw new Error()

}
res.set('Content-Type','image/png')
res.send(user.avatar)
  }
  catch(error)
  {
     res.status(404).send(error.message)
  }

})
module.exports=router