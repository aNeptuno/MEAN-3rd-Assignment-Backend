import * as express from 'express';
import * as mongodb from 'mongodb';
import { collections } from './database';

export const employeerouter = express.Router();
employeerouter.use(express.json());


employeerouter.get('/', async(_req,res)=>{
    try{
        const employees = await collections.employees.find({}).toArray();
        res.status(200).send(employees);
    } catch(e){
        res.status(500).send(e.message);
    }
});

employeerouter.get('/:id', async(req,res)=>{
    try{
        const id = req?.params?.id;
        const query = {_id: new mongodb.ObjectId(id)};
        const employee = await collections.employees.findOne(query);
        
        if(employee) {
            res.status(200).send(employee);
        } else {
            res.status(404).send(`Failed to find an employee with ID: ${id}`)
        }
    } catch(e){
        res.status(404).send(`Failed to find an employee with ID: ${req?.params?.id}`);
    }
});


//Implementing post end point
employeerouter.post('/', async(req,res)=>{
    try{
        const employee = req.body;
        const result = await collections.employees.insertOne(employee);

        if (result.acknowledged){
            res.status(201).send(`Created new employee`);
        } else {
            res.send(500).send("Failed to create new employee");
        }

    } catch(e) {
        console.error(e);
        res.status(400).send(e.message);
    }
});

employeerouter.put('/:id', async(req,res)=>{
    try{
        const id = req?.params?.id;
        const employee = req.body;
        const query = {_id: new mongodb.ObjectId(id)};
        const result = await collections.employees.updateOne(query, {$set: employee});

        if(result && result.matchedCount){
            res.status(200).send(`Updated an employee ID ${id}`)
        } else if(!result.matchedCount){
            res.status(404).send(`Failed to find an employee with ID ${id}`)
        } else {
            res.status(304).send(`Failed to update an employee with ID ${id}`)
        }

    } catch(e) {
        console.error(e.message);
        res.status(404).send(e.message)
    }
})

employeerouter.delete('/:id', async(req,res)=>{
    try{
        const id = req?.params?.id;
        const query = {_id: new mongodb.ObjectId(id)};
        const result = await collections.employees.deleteOne(query);

        if(result && result.deletedCount){
            res.status(202).send(`Removed an employee with ID ${id}`)
        } else if(!result){
            res.status(400).send(`Failed to remove an employee with ID ${id}`)
        } else {
            res.status(404).send(`Failed to find an employee with ID ${id}`)
        }

    } catch(e) {
        console.error(e.message);
        res.status(404).send(e.message)
    }
})
