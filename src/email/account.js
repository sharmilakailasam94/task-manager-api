 const nodemailer=require('nodemailer')

let transporter=nodemailer.createTransport({
  service:'gmail',
  auth:{
    user:process.env.USER_NAME,
    pass:process.env.PASSWORD
  },
  tls:{
    rejectUnauthorized:false
  }
})



const sendWelcomeEmail=(email,name)=>
{

   transporter.sendMail({
  from:'sharmilakailasam@gmail.com',
  to:email,
  subject:'Welcome to the task manger',
  text:'thanks for joining in '+name+' let me know how you get along with the app.'

}).then((data)=>
{
  console.log('email sent sucessfully',data)

}).catch((error)=>
{
console.log(error)
})
}

sendCancelEmail= (email,name)=>
{
   transporter.sendMail({
    from:'sharmilakailasam@gmail.com',
    to:email,
    subject:'Account to the task manger deleted '+name+'.',
    text:'let us know, what makes you delete your account'
  
  }).then((data)=>
  {
    console.log('email sent sucessfully',data)
  
  }).catch((error)=>
  {
  console.log(error)
  })

}




module.exports =
  {
    sendWelcomeEmail,
    sendCancelEmail
  }
 