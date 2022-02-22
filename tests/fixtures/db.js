const mongoose=require('mongoose')
const jwt=require('Jsonwebtoken')
const User=require('../../src/models/user')
const Tasks=require('../../src/models/task')

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

const userTwoId=new mongoose.Types.ObjectId()

const userTwo={
    _id:userTwoId,
    name:'efghij',
    email:'efghij@gmal.com',
    password:'efghij',
    tokens:[{
        token:jwt.sign({_id:userTwoId},process.env.JWT_SECRET)
    }]
}

const taskOne={
    _id:new mongoose.Types.ObjectId(),
    description:' first task',
    completed:true,
    owner: userOne._id
}

const taskTwo={
    _id:new mongoose.Types.ObjectId(),
    description:'second task',
    completed:true,
    owner: userOne._id
}
const taskThree={
    _id:new mongoose.Types.ObjectId(),
    description:'third task',
    completed:true,
    owner: userTwo._id
}


const setupDatabase=async()=>
{
    await User.deleteMany()
    await Tasks.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Tasks(taskOne).save()
    await new Tasks(taskTwo).save()
    await new Tasks(taskThree).save()

}

module.exports={
    userOneId,
    userOne,
    setupDatabase,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree

}