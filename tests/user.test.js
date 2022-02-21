const request=require('supertest')
const mongoose=require('mongoose')
const jwt=require('Jsonwebtoken')
const app=require('../src/app')
const User=require('../src/models/user')

const userOneId=new mongoose.Types.ObjectId()

const userOne={
    _id:userOneId,
    name:'abcdef',
    email:'abcdef@gmal.com',
    password:'abcdef',
    tokens:[{
        token:jwt.sign({_id:userOneId},process.env.JWT_SECRET)
    }]

}


beforeEach(async()=>
{
await User.deleteMany()
await new User(userOne).save()
})

/* afterEach(()=>
{
    console.log('afterEach')
}) */


test('should signup a new user',async()=>
{ 
    const response=await request(app).post('/users').send({
        name:'maggie',
        email:'maggie@gmal.com',
        password:'study4u'
    }).expect(201)
 
    // Asser that database was changed correctly.

const user=await User.findById(response.body.user._id)
expect(user).not.toBeNull()

//Assertions about the response.
expect(response.body).toMatchObject({
   user:{ name:'maggie',
          email:'maggie@gmal.com'
        },
          token:user.tokens[0].token
        })
   expect(user.password).not.toBe('study4u')       
})


test('should login a existing user',async()=>
{
const response=await request(app).post('/users/login').send({
    email:userOne.email,
    password:userOne.password

}).expect(200)

const user=await User.findById(userOneId)
expect(response.body.token).toBe(user.tokens[1].token)



})


 test('should not login a non-existing user',async()=>
{
    await request(app).post('/users/login').send({
                    email:'meena@gmail.com',
                    password:'sometext',
                    
    }).expect(400)


}) 
 

test('should display the users profile',async()=>
{
  await request(app)
  .get('/users/me')
  .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(200)
})


test('Should not display profile for unauthorized user',async()=>
{
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('should delete account for authorized user',async()=>
{
           await request(app)
           .delete('/users/me')
           .set('Authorization', `Bearer ${userOne.tokens[0].token}`) 
           .send()
           .expect(200) 


const user=await User.findById(userOneId)
expect(user).toBeNull()
})



test('should not delete unauthorized user',async()=>
{
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
}) 

test('should upload a profile pic',async()=>
{
    await request(app)
    .post('/users/me/avatar')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .attach('avatar','tests/fixtures/profile-pic.jpg')
    .expect(200)

    const user=await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})


test('should update a valid user field',async()=>
{
    await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        name:'abcdefg',
        email:'abcdefg@gmal.com'
    })
    .expect(200)

    const  user= await User.findById(userOneId)
    expect({
        name:user.name,
        email:user.email
    }).toEqual({
        name:'abcdefg',
        email:'abcdefg@gmal.com'
    })
})

test('should not  update a valid invalid field',async()=>
{
    await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        location:'chennai'
    })
    .expect(400)
})

