const request=require('supertest')
const app=require('../src/app')
const User=require('../src/models/user')
const {
    userOneId,
    userOne,
    setupDatabase,
    userTwo,
    UserTwoId,
    taskOne,
    taskTwo,
    taskThree}=require('./fixtures/db')


beforeEach(setupDatabase)




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

test('should not sign up for user without name or invalid name',async()=>
{
    const response=await request(app)
    .post('/users')
    .send({
                
        email:'santa@gmeil.com',
        password:'fghj'
    }).expect(400)
 const user=await User.findOne({email:'santa.com'})
 expect(user).toBeNull()
})

test('should not signup for invalid email id',async()=>
{
    const response=await request(app)
    .post('/users')
    .send({
        name:'santa',    
        email:'santa@.com',
        password:'fghj3444'
    }).expect(400)
 const user=await User.findOne({email:'santa.com'})
 expect(user).toBeNull()
})
test('should not signup for invalid password',async()=>
{
    const response=await request(app)
    .post('/users')
    .send({
        name:'saSta',    
        email:' Santa@mdsfg.com ',
        password:'password'
    }).expect(400)
 const user=await User.findOne({email:'santa.com'})
 expect(user).toBeNull()
})







// user test cases