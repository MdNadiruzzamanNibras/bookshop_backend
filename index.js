const express = require('express')
const bodyParser = require("body-parser");
const cors = require('cors');
require('dotenv').config();
const app = express()
 const port = process.env.PORT || 5000;

const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qrmeula.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
   
   client.connect();
  
    const BookCollection = client.db('Books').collection('book');
    
     app.get('/books', async (req, res) => {
      const cursor = BookCollection.find({});
      const book = await cursor.toArray();

      res.send(book);
     });
    
    app.get('/book/:id', async (req, res) => {
      const id = req.params.id;
     const result = await BookCollection.findOne({ _id: new ObjectId(id) });
      
      res.send(result);
    });

    app.put('/edit/:id', async (req, res) => {
  const { id } = req.params; 
      const book = req.body; 
      

      const result = await BookCollection.updateOne({ _id: new ObjectId(id) },
        { $set: book },
      { upsert: true });
    
      res.json(result);
     
    });
    app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id
    const query = {_id: new ObjectId(id)}
    const result = await BookCollection.deleteOne(query)
      res.send(result)
      console.log(result, "delelte");

}) 
    
    app.post('/addnew', async (req, res) => {
  const book = req.body;
  const result = await BookCollection.insertOne(book);
  res.send(result);
    });
    
   app.post('/review/:id', async (req, res) => {
  const id = req.params.id;
  const updatedReview = req.body;
  
  const result = await BookCollection.updateOne(
    { _id: new ObjectId(id) },
    { $push: { reviews: updatedReview } }
  );

  if (result.modifiedCount  !== 1) {
    return res.status(404).json({ error: 'Review not found' });
  }

  return res.json({ message: 'Review updated successfully', updatedReview });
});

    app.get('/review/:id', async (req, res) => {
  const id = req.params.id;

  const result = await BookCollection.findOne(
    { _id: new ObjectId(id) },
   
  );

  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: 'Review not found' });
  }
});

  } finally {
   
    await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})