const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// Declare a middletier funtion to minimize Repitation 
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized' })
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).send({ message: 'forbidden' })
        }
        req.decoded = decoded;
        next()
    })
}


// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Running JWT Server!');
})


// Create post method:
app.post('/login', (req, res) => {
    const user = req.body;
    console.log(user);
    // Do not password here for serious application
    // Use proper way for hashing and checking
    // After completing all authentication related verification  issue the jwt token then we will use jwt token!
    if (user.email === 'user@gmail.com' && user.pass === '123456') {
        const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1hr' })
        res.send({
            success: true,
            accessToken: accessToken
        });

    }
    else {
        res.send({
            success: false
        })
    }

})


app.get('/orders', verifyJWT, (req, res) => {

    res.send([
        { id: 1, item: 'Mouse' },
        { id: 2, item: 'Keyboard' }
    ])
})

app.listen(port, () => {
    console.log('Listening to port', port)
})
