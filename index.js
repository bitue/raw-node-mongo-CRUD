const express = require('express')
const app = express()
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId

const port = 5001;
app.use(cors())
app.use(express.json())

const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://myDBuser:YQsA6bn4hbxNO9EM@cluster0.1ytj1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
  try {
    await client.connect();
    const database = client.db("Ema-jhon");
    const userCollection = database.collection("users");
    //create express api here 

    app.get('/users', async (req, res) => {
      const cursor = userCollection.find({})
      const cursorArray = await cursor.toArray() // make it array to wait
      res.send(cursorArray)

    })

    app.get('/users/update/:id', async (req, res) => {
      const id = req.params.id
      console.log(id)

      const query = { _id: ObjectId(id) }
      const user = await userCollection.findOne(query);
      console.log(user)
      res.send(user)




    })

    app.put('/users/:id', async (req, res) => {
      const updateUser = req.body;
      const id = req.params.id;
      const filter = { _id: ObjectId(id) }

      const updateDoc = {
        $set: {
          name: updateUser.name,
          email: updateUser.email

        },
      };

      const result = await userCollection.updateOne(filter, updateDoc);
      res.send(result)
    })



    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log(user);
      //add the user to the mongo server 
      const result = await userCollection.insertOne(user)
      res.send(result)
      console.log(result)
    })

    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id)
      const query = { _id: ObjectId(id) }
      const result = await userCollection.deleteOne(query)

      res.send(result)
      console.log(result)

    })

  } finally {
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('running my crud2 server')
})



app.listen(port, () => {
  console.log('.....connecting with', port)
})