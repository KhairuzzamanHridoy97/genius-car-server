const express = require('express');
const { MongoClient } = require('mongodb');
const objectId = require('mongodb').ObjectId ;

const cors = require('cors');
require('dotenv').config();


const app = express();
const port =5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bttmq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('carMechanic');
        const serviceCollection = database.collection('services');

        //GET API
        app.get('/services',async(req,res)=>{
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

        //GET SINGLE Service
        app.get('/services',async(req,res)=>{
            const id = req.params.id;
            console.log('getting specific service',id)
            const query = {_id:ObjectId(id)}
            const service = await serviceCollection.findOne(query);
            res.json(service);
        })

        // POST API
        app.post('/services',async(req,res)=>{
            const service = req.body;
            console.log('hit the post api',service);
            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result)
        })
    }
    finally{
        // await client.close();
    }

}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('Running Genius Server');
})

app.listen(port ,()=>{
    console.log('Running Genius Server on port',port);
})