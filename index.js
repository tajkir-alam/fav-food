require('dotenv').config()
const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h2ziqne.mongodb.net/?retryWrites=true&w=majority`;

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
        client.connect();
        console.log("Database Connected Successfully with MongoDB");

    } catch (error) {
        console.log(error.name, error.message);
    }
}
dbConnect()


const usersCollection = client.db("FavFood").collection("users");
const menuCollection = client.db("FavFood").collection("menu");


app.get('/users', async (req, res) => {
    const users = usersCollection.find()
    const cursor = await users.toArray();
    res.send(cursor);
})

app.get('/menu', async (req, res) => {
    const menu = menuCollection.find();
    const cursor = await menu.toArray();
    res.send(cursor);
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})