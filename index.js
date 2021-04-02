const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config();



console.log(process.env.DB_PASS);
const port = process.env.PORT || 8080







const app = express()
app.use(cors());
app.use(bodyParser.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.olhny.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log(err);
  const collection = client.db("purnimaSaree").collection("products");
  const orderCollection = client.db("purnimaSaree").collection("order");
  console.log("db connected ");
  app.get('/product', (req, res) => {
    collection.find()
      .toArray((err, items) => {
        res.send(items)
      })
  })
  app.get('/product/:_id', (req, res) => {
    collection.find({_id: ObjectId(req.params._id)})
      .toArray((err, items) => {
        console.log(items);
        res.send(items)
      })
  })
  app.get('/orders', (req, res) => {
    orderCollection.find()
      .toArray((err, items) => {
        console.log(items);
        res.send(items)
      })
  })
  app.post('/addEvent', (req, res) => {
    const newEvent = req.body;
    console.log('adding: ', newEvent);
    collection.insertOne(newEvent)
      .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })
  app.post('/orderEvent', (req, res) => {
    const order = req.body;
    orderCollection.insertOne(order)
      .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount > 0)
      })
  })
  app.delete('/deleteProduct/:id',(req, res)=>{
    collection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result=>{
      console.log(result);
          })
  })


});

app.listen(port)