const { Client } = require('pg');

// Create a new PostgreSQL client
const client = new Client({
    user: 'postgres', // Replace with your PostgreSQL username
    host: 'localhost', // Replace with your PostgreSQL host
    database: 'blogdb', // Replace with your database name
    password: 'sim@wrote', // Replace with your PostgreSQL password
    port: 5432, // Default PostgreSQL port
});

async function check(){
    await client.connect()
    // const res = await client.query('SELECT * from blogs')
    // console.log(res.rows[0]) // Hello world!
    // await client.end()    
}

check();
module.exports = client;