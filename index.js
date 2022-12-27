const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 5000;

/*
User Name: dbForEcomm
Password: 4k3OnGEz3lUNgYm9
*/

const uri =
  "mongodb+srv://dbForEcomm:4k3OnGEz3lUNgYm9@ecommerce.wepyuhc.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const productCollection = client.db("ecommerce").collection("products");
    app.get("/products", async (req, res) => {
      const query = {};
      const cursor = productCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });

    app.post("/addProduct", async (req, res) => {
      const body = req.body;
      await client.db("ecommerce").collection("products").insertOne(body);
    });
    app.put("/updateProduct", async (req, res) => {
      const body = req.body;
      await client
        .db("ecommerce")
        .collection("products")
        .updateOne({ProductShortCode:body.ProductShortCode},{$set:body},function(err,res){
            if(err) throw err;
        });
        res.send(body);
    });
    app.delete("/deleteProduct/:id", async (req, res) => {
      const products = await client
        .db("ecommerce")
        .collection("products")
        .findOneAndDelete({ ProductShortCode: req.params.id });
      res.send(products);
    });

    app.post("/cart/addToCart", async (req, res) => {
      const body = req.body;
      console.log(body);
      //   db.cartCollection.save(body);
      await client.db("ecommerce").collection("carts").insertOne(body);
    });

    const cartCollection = client.db("ecommerce").collection("carts");
    app.get("/cart", async (req, res) => {
      const query = {};
      const cursor = cartCollection.find(query);
      const cart = await cursor.toArray();
      res.send(cart);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log("Listening to port ", port);
});
