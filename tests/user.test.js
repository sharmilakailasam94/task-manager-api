const request=require('supertest')
const app=require('../src/app')
const User=require('../src/models/user')



const userOne={
    name:'sharmila',
    email:'wsfagc@gmcc.com',
    password:'sharmila94'

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
    await request(app).post('/users').send({
        name:'aasvgv',
        email:'assascs@gsnn.com',
        password:'kailasam'
    }).expect(201)
})


test('should login a existing user',async()=>
{
await request(app).post('/users/login').send({
    email:userOne.email,
    password:userOne.password

}).expect(200)
})


 test('should not login a non-existing user',async()=>
{
    await request(app).post('/users/login').send({
                    email:'meeena@gmail.com',
                    password:'adszfdz',
                    
    }).expect(400)


}) 
 