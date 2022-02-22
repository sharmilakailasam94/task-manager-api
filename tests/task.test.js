const request=require('supertest')
const app=require('../src/app')
const Tasks = require('../src/models/task')
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

test('should create a new task for a user',async()=>
{
   const response = await request(app)
   .post('/tasks')
   .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
   .send({
       description:'task one'
   }).expect(201)
 const task = await Tasks.findById(response.body._id)
expect(task).not.toBeNull() 
expect(task.completed).toBe(false)
})

test('should fetch a tasks list for userOne',async()=>
{
  const response = await request(app)
   .get('/tasks')
   .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
   .send()
   .expect(200)

expect(response.body.length).toBe(2)

})

test('second user should not delete other users task',async()=>
{
  await request(app)
  .delete(`/tasks/${taskOne._id}`)
  .set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
  .send()
  .expect(404)


  const taskone= await Tasks.findOne({_id:taskOne._id,owner:userOne._id})
  expect(taskone).not.toBeNull()

})

test('should not create task without valid description',async()=>
{
  await request(app)
  .post('/tasks')
  .set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
  .send()
  .expect(400)
})

test('should not create task without valid description',async()=>
{
  await request(app)
  .patch(`/tasks/${taskThree._id}`)
  .set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
  .send({
    completed:'234e'}
  )
  .expect(400)
})

test('should not update task without invalid description',async()=>
{
  await request(app)
  .patch(`/tasks/${taskThree._id}`)
  .set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
  .send({
    description:'',
    completed:true}
  )
  .expect(400)
})

test('should delete users task',async()=>
{
 const response = await request(app)
  .delete(`/tasks/${taskThree._id}`)
  .set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
  .send()
  .expect(200)
task = await Tasks.findById(response.body._id)  // deleted task is displayed in response.body, when you deleted it 
expect(task).toBeNull()

})


test('should not  delete unauthorized users task',async()=>
{
 const response = await request(app)
  .delete(`/tasks/${taskThree._id}`)  
  .send()
  .expect(401)
expect(response.body._id).not.toBe(taskThree._id) 

})


test('should not update task for other users',async()=>
{
 const response= await request(app)
  .patch(`/tasks/${taskThree._id}`)
  .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
  .send({
       completed:true
  })
  .expect(404)
})


test(' Should fetch user task by id',async()=>
{
  const response=await request(app)
  .get(`/tasks/${taskOne._id}`)
  .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(200)
  const task = await Tasks.findById(response.body._id)
  expect(task.description).toEqual('first task')

})


test(' // Should not fetch user task by id if unauthenticated',async()=>
{
  const response=await request(app)
  .get(`/tasks/${taskOne._id}`)
  .send()
  .expect(401)
  expect(response.body._id).not.toBe(taskOne._id)

})


test(' Should not fetch other users task by id',async()=>
{
  const response=await request(app)
  .get(`/tasks/${taskThree._id}`)
  .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(404)
 const task = await Tasks.findById(response.body._id)
 expect(task).toBeNull()
})


test('Should fetch only completed tasks',async()=>
{
  const response=await request(app)
  .get('/tasks?completed=true')
  .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(200)
  //const tasks= await Tasks.find({owner:userOne._id})
 //expect(tasks.length).toBe(2)
 expect(response.body.length).toEqual(2)
})


test('Should fetch only incompleted tasks',async()=>
{
  const response=await request(app)
  .get('/tasks?completed=false')
  .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(200)
  expect(response.body.length).toEqual(0)
})


test(' Should sort tasks by description',async()=>
{
  const response=await request(app)
  .get('/tasks?sortby=descrription:desc')
  .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(200)
  //const tasks= await Tasks.find({owner:userOne._id})
 //expect(tasks.length).toBe(2)
 expect(response.body.length).toEqual(2)
})


test(' Should sort tasks by completed',async()=>
{
  const response=await request(app)
  .get('/tasks?sortby=completed:desc')
  .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(200)
  //const tasks= await Tasks.find({owner:userOne._id})
 //expect(tasks.length).toBe(2)
 expect(response.body.length).toEqual(2)
})

test(' Should sort tasks by createdAt/updatedAt',async()=>
{
  const response=await request(app)
  .get('/tasks?sortby=createdAt:desc')
  .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(200)
  //const tasks= await Tasks.find({owner:userOne._id})
 //expect(tasks.length).toBe(2)
 expect(response.body.length).toEqual(2)
})


test(' Should sort tasks by /updatedAt',async()=>
{
  const response=await request(app)
  .get('/tasks?sortby=createdAt:asc')
  .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(200)
  //const tasks= await Tasks.find({owner:userOne._id})
 //expect(tasks.length).toBe(2)
 expect(response.body.length).toEqual(2)
})


test(' Should sort tasks by updatedAt',async()=>
{
  const response=await request(app)
  .get('/tasks?sortby=updatedAt:asc')
  .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(200)
  //const tasks= await Tasks.find({owner:userOne._id})
 //expect(tasks.length).toBe(2)
 expect(response.body.length).toEqual(2)
})


test(' Should fetch page of tasks',async()=>
{
  const response=await request(app)
  .get('/tasks?sortby=createdAt:desc&limit=2&skip=1')
  .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
  .send()
  .expect(200)
  //const tasks= await Tasks.find({owner:userOne._id})
 //expect(tasks.length).toBe(2)
 expect(response.body.length).toEqual(1)
})









 
