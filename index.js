require('dotenv').config();
const express = require('express');

const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


const app = express()
const port = process.env.PORT || 5013

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sxdrhxr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   }
});
const dbConnect = async () => {
   try {
      // client.connect()
      console.log('DB Connected Successfully✅')
   } catch (error) {
      console.log(error.name, error.message)
   }
}
dbConnect()

const tasksCollection = client.db('Task_Management_SSC-technovision-INC').collection('tasks');

// specific email holder user data from db
app.get('/tasks', async (req, res) => {
   console.log(req.query.email);
   // console.log('token owner',req.user);
   let query = {}
   if (req.query?.email) {
      query = { email: req.query.email }
   }
   const result = await tasksCollection.find(query).toArray();
   res.send(result);
});

app.patch('/tasks/:id', async (req, res) => {
   const id = req.params.id;
   console.log(id);
   const filter = { _id: new ObjectId(id) }
   const { section } = req.body;
   console.log(section)
   const updatedDoc = {
      $set: {
         section: section === 'OnGoing' ? 'OnGoing' : section === 'Completed' ? 'Completed' : 'ToDo'
      }
   }
   const result = await tasksCollection.updateOne(filter, updatedDoc);
   res.send(result);
   });

// post tasks
app.post('/tasks', async (req, res) => {
   const task = req.body;
   console.log(task);
   const result = await tasksCollection.insertOne(task);
   res.send(result)
});

app.get('/', (req, res) => {
   res.send('Task Management is running!!');
})


app.listen(port, () => {
   console.log(`Server is running on port ${port}`)
})