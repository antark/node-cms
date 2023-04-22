const { MongoClient } = require('mongodb');

var client;
function main() {
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/drivers/node/ for more details
     */
    const uri = "mongodb://localhost/node?retryWrites=true&w=majority";
    
    /**
     * The Mongo Client you will use to interact with your database
     * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
     * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
     * pass option { useUnifiedTopology: true } to the MongoClient constructor.
     * const client =  new MongoClient(uri, {useUnifiedTopology: true})
     */
    client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        client
            .connect()    
            .catch(err => {
                console.log(err.stack);
                process.exit(1);

            });

        // Make the appropriate DB calls

    } finally {
        // Close the connection to the MongoDB cluster
        client.close();
    }
}

main();

// Add functions that make DB calls here

exports.db = client.db('node');
