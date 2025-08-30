import { Db, MongoClient, ServerApiVersion } from "mongodb";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;
export async function connectToDb() {
  const uri = `mongodb+srv://tecrajesh_db_user:pSaQf0JtjY28GBmN@cluster0.wufsdvy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

  if (cachedClient && cachedDb) {
    return {
      client: cachedClient,
      db: cachedDb,
    };
  }

  // Create a MongoClient with a MongoClientOptions object to set the Stable API version
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    cachedClient = client;
    cachedDb = client.db("ecommerce-nextjs");

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    return {
      client,
      db: client.db("ecommerce-nextjs"),
    };
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
