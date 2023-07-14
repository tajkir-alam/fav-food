require('dotenv').config()
const express = require('express')
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
const cartCollection = client.db("FavFood").collection("cart");
const orderCollection = client.db("FavFood").collection("order");


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

app.get('/cart', async (req, res) => {
    const cart = cartCollection.find();
    const result = await cart.toArray();
    res.send(result);
})

app.post('/cart', async (req, res) => {
    const cart = req.body;
    const result = await cartCollection.insertOne(cart);
    res.send(result);
})

app.delete('/cart/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await cartCollection.deleteOne(query);
    res.send(result)
})

app.patch('/cart/decrease-quantity/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updateQuantity = [
        {
            $set: {
                quantity: { $subtract: ["$quantity", 1] },
                price: {
                    $multiply: [{ $subtract: ["$price", 0] }]
                }
            }
        }
    ];
    const result = await cartCollection.updateOne(filter, updateQuantity);
    res.send(result);
})

app.patch('/cart/increase-quantity/:id', async (req, res) => {
    const id = req.params.id;
    const filter = { _id: new ObjectId(id) };
    const updateQuantity = [
        {
            $set: {
                quantity: { $add: ["$quantity", 1] },
                price: {
                    $add: [{ $toDouble: "$price" }, 0]
                }
            }
        }
    ];
    const result = await cartCollection.updateOne(filter, updateQuantity);
    res.send(result);
})




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})