// implement your API here
const express = require('express');
const cors = require('cors')

const db = require('./data/db.js');

const server = express();

server.use(express.json());
server.use(cors({origin: 'http://localhost:3000'}));


server.get('/', (req, res) => {
    res.json('Server is working');
});

// Get request to fetch users

server.get('/api/users', (req, res) => {
    db.find()
        .then(users => {
            if (users) {
                res.status(200).json({ users });
            }
            else {
                res.status(500).json({ message: "The users information could not be retrieved." })
            }
        })
        .catch(({code, message}) => {
            res.status(code).res.json({err: message})
        }) 
});

//get a user by id

server.get('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.findById(id)
    .then(user => {
        if(user) {
            res.status(200).json(user);
        }
        else {
            res.status(404).json({ message: "The user with that ID does not exist." })
        }
    })
    .catch(({code, message}) => res.status(code).json({err: message}));
})

// add/post a user

server.post('/api/users', (req, res) => {
    const user = req.body;
    
    db.insert(user)
    .then(idInfo => {
        if (user.name && user.bio) {
            db.findById(idInfo.id).then(user => {
                res.status(201).json(user);
            })
        }
        else {
            res.status(400).json({ message: "Please provide name and bio for the user." })
        }
    })
    .catch(({code, message}) => res.status(code).json({
        err: message, message: 'oops'
    }));
    
})
//update user in db
server.put('/api/users/:id', (req, res) => {
    const id = req.params.id;
    const newUser = req.body;
    db.update(id, newUser)
        .then(user => {
            if (user) {
                db.findById(id)
                    .then(user_change => {
                        res.status(201).json(user_change);
                        console.log('Item Updated');
                    })  
            }
            else {
                res.status(400).json({ message: 'The user could not be found' });
            }
        })
    
        .catch(({ code, message }) => {
            res.status(code).json({ err: message})
        });
});

//deleteuser from db
server.delete('/api/users/:id', (req, res) => {
    const id = req.params.id;
    db.remove(id)
        .then(user => {
            if (user) {
                res.json('user deleted');
            }
            else {
                res.status(404).json({ message: 'The user could not be found' })
            }
        })
        .catch(({code, message}) => {
            res.status(code).json({ err: message })
        })
});

server.listen(8000, () => console.log('Running on port 8000'))
