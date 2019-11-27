const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient

 let db;
const mongoConnect = callback => {
    MongoClient.connect('mongodb+srv://Mubarak:Olamilekan1996@cluster0-mrvec.mongodb.net/shop ?retryWrites=true&w=majority')
    .then(client =>{
        console.log('connected!!!'); 
        db = client.db(); 
        callback();
    })
    .catch(err => {
        console.log(err);
        throw err;
    })
}

const getDatabase = () =>{
    if(db){
        return db;
    }
    throw 'database not found';
}

exports.mongoConnect = mongoConnect;
exports.getDatabase = getDatabase;