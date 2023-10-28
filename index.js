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
  
    const BookCollection = client.db('Books').collection('data');
    
     app.get('/books', async (req, res) => {
      const cursor = BookCollection.find({});
      const book = await cursor.toArray();

      res.send(book);
     });
    
    app.get('/book/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id, "id");
     const result = await BookCollection.findOne({ _id: new ObjectId(id) });
      console.log(result, "result");
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
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