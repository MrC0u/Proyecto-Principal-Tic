const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 8080;

app.use(express.json())
app.use(cors());
app.use(express.urlencoded({ extended: false }));

// routes
app.use(require('./routes/index'))

app.listen(
    PORT,
    () => console.log('Corrientdo en http://localhost:8080'),
);

/*
app.get('/test', (req, res) => {
    res.status(200).send({
        test: 'Funciona'
    })
});

*/