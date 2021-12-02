const { Client } = require('pg');

const client = new Client({
    user: 'mrcou',
    host: '192.168.100.19',
    database: 'tics',
    password: '12345',
    port: 5432,
})

client.connect()

client.query('SELECT * from test', (err, res) => {
    console.log(err, res)
    client.end()
})