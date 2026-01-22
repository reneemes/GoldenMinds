const express = require('express');

const app = express();

//SignUp for New User
app.post('/signup', async (req,res)=>{
    const { firstName, email, password} = req.body;
    try{
        const newUser = User.create({firstName, email, password})
        .promise()
        .query(
            `INSERT INTO users (firstName, email, password) VALUES (?, ?, ?)
        )`, [firstName, email, password]);
        res.status(201).json({message: "User created successfully", user: newUser});
    }catch(error){
        res.status(500).json({message: "Error creating user", error: error.message});
    }
)

//Sign In for Existing User
app.post('/signin', async (req,res)=>{
    const { email, password } = req.body;
    try{
        const user = await User.findOne({ where: { email, password } });
        if(user){
            res.status(200).json({message: "Sign in successful", user: user});
        } else{
            res.status(401).json({message:"Invalid credentials"});
        }
    }catch(error){
        res.status(500).json({message: "Error signing in", error: error.message});
    }

})