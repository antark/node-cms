const { MongoClient } = require('mongodb');

var client;
async function mongo_main() {
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/drivers/node/ for more details
     */
    const uri = "mongodb://localhost:27017/node?retryWrites=true&w=majority";
    
    /**
     * The Mongo Client you will use to interact with your database
     * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
     * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
     * pass option { useUnifiedTopology: true } to the MongoClient constructor.
     * const client =  new MongoClient(uri, {useUnifiedTopology: true})
     */

    try {
        // Connect to the MongoDB cluster
	client = new MongoClient(uri,
            { useNewUrlParser: true, useUnifiedTopology: true});
	await client.connect();
        // Make the appropriate DB calls

    }catch(e){
    	console.log(JSON.stringfiy(s));
    } finally {
        // Close the connection to the MongoDB cluster
        // client.close();
    }
}

mongo_main();

// Add functions that make DB calls here

exports.db = client.db('node');
