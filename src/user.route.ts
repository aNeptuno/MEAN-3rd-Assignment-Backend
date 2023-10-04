import * as express from 'express';
import * as mongodb from 'mongodb';
import { collections } from './database';

export const userrouter = express.Router();
userrouter.use(express.json());


userrouter.get('/', async(_req,res)=>{
    try{
        const users = await collections.users.find({}).toArray();
        res.status(200).send(users);
    } catch(e){
        res.status(500).send(e.message);
    }
});

userrouter.get('/:id', async(req,res)=>{
    try{
        const id = req?.params?.id;
        const query = {_id: new mongodb.ObjectId(id)};
        const user = await collections.users.findOne(query);
        
        if(user) {
            res.status(200).send(user);
        } else {
            res.status(404).send(`Failed to find an user with ID: ${id}`)
        }
    } catch(e){
        res.status(404).send(`Failed to find an user with ID: ${req?.params?.id}`);
    }
});


//Implementing post end point
userrouter.post('/', async(req,res)=>{
    try{
        const user = req.body;
        const result = await collections.users.insertOne(user);

        if (result.acknowledged){
            res.status(201).send(`Created new user`);
        } else {
            res.send(500).send("Failed to create new user");
        }

    } catch(e) {
        console.error(e);
        res.status(400).send(e.message);
    }
});

userrouter.put('/:id', async(req,res)=>{
    try{
        const id = req?.params?.id;
        const user = req.body;
        const query = {_id: new mongodb.ObjectId(id)};
        const result = await collections.users.updateOne(query, {$set: user});

        if(result && result.matchedCount){
            res.status(200).send(`Updated an user ID ${id}`)
        } else if(!result.matchedCount){
            res.status(404).send(`Failed to find an user with ID ${id}`)
        } else {
            res.status(304).send(`Failed to update an user with ID ${id}`)
        }

    } catch(e) {
        console.error(e.message);
        res.status(404).send(e.message)
    }
})

userrouter.delete('/:id', async(req,res)=>{
    try{
        const id = req?.params?.id;
        const query = {_id: new mongodb.ObjectId(id)};
        const result = await collections.users.deleteOne(query);

        if(result && result.deletedCount){
            res.status(202).send(`Removed an user with ID ${id}`)
        } else if(!result){
            res.status(400).send(`Failed to remove an user with ID ${id}`)
        } else {
            res.status(404).send(`Failed to find an user with ID ${id}`)
        }

    } catch(e) {
        console.error(e.message);
        res.status(404).send(e.message)
    }
})
