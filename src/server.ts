import * as dotenv from 'dotenv';
import cors from 'cors';
import express from 'express';
import { connectToDB } from './database';
import { employeerouter } from './employee.route';

dotenv.config();

const {ATLAS_URI} = process.env;
const {BASE_URL} = process.env;
const {PORT} = process.env;


//error Handling
if(!ATLAS_URI){
    console.error("No ATLAS_URI environment variable has been declared on config.env");
    process.exit(1);
}

connectToDB(ATLAS_URI)  
.then(()=>{
    const app = express();
    app.use(cors());

    app.use("/employees", employeerouter)
    app.listen(PORT, ()=>{
        console.log(`Successfully connected to MongoDB Atlas`);
        console.log(`Server running at ${BASE_URL}`);
    })

    app.get('/' ,(req: any,res: { send: (arg0: string) => void; })=>{
        res.send('App is working (:')
    })
})
.catch(e=>console.error(e));