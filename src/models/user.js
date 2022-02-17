const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt= require('bcrypt')
const jwt=require('jsonwebtoken')
const Tasks=require('./task')
const userSchema= new mongoose.Schema({
    name:{
       type:String,
       required:true,
       trim:true
    },
    email:{
      type:String,
      unique:true,
      dropDups:true,
      required:true,
      trim:true,
      lowercase:true,
      async validate(value)
       {
        if(!validator.isEmail(value))
          {
             throw new Error('Invalid Email id')
          }
 
       }
     },
     password:{
        type:String,
        required:true,
        trim:true,
        minLength:6,
        validate(value)
        {
            if( value.toLowerCase().includes('password'))
            {
                throw new Error('Password shouldnt be password, use some other word.')
            }
            /* if( value.length<6)
            {
                throw new Error(' length of your password should be greater than 6.')
            } */
        }

     },
    age:
    {
        type:Number,
        default:0,
        validate(value)
             {
        if(value<0)
                {
            throw new Error('Age must be a positive number')
                }
             }
           },

    tokens:[{token:{type:String,required:true}}],
    
    avatar:
    {
        type:Buffer
    }

},{
  timestamps:true  
})

userSchema.virtual('tasks',{
    ref:'Tasks',
    localField:'_id',
    foreignField:'owner'
})


 userSchema.methods.toJSON= function(){
    const user=this
   const userObject=user.toObject()
   delete userObject.password
   delete userObject.tokens
   delete userObject.avatar

   return userObject

} 


userSchema.methods.generateAuthToken=async function(){     // methods when we use a instance ,variable or objects directly
    const user =this

    const token =  jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens=user.tokens.concat({token})

    await user.save()
    return token
}


userSchema.statics.findByCredentials=async(email,password) =>       // statics when we use model 
{
    const user= await User.findOne({email})
    if(!user){
        throw new Error('No user found')
    }

    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch)
    {
        throw new Error('unable to login')
    }
    return user
    
}


userSchema.pre('save',async function(next)
{
const user=this
 if(user.isModified('password'))
{
    user.password = await bcrypt.hash(user.password,8)
}
 
next()

})

userSchema.pre('remove', async function(next)
{
    const user=this
    await Tasks.deleteMany({ owner: user._id})
    next()
})

const User=mongoose.model('User',userSchema)

User.createIndexes()

module.exports=User