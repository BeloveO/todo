import express from 'express';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import User from './models/User.js';
import Task from './models/Task.js';
import cors from 'cors';
import jwt from 'jsonwebtoken';


dotenv.config();

// connect to mongodb server
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
   .then(() => console.log('Connected to MongoDB'))
   .catch(err => console.error('Error connecting to MongoDB:', err));

const app = express();
app.use(cookieParser());
app.use(bodyParser.json({ extended: true }));
app.use(cors(
    {
        origin: 'http://localhost:3000',
        credentials: true,
    }
));


app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.get('/user', (req, res) => {
    // check if user is authenticated
    if (!req.cookies.token) {
        return res.json({});
    }

    const payload = jwt.verify(req.cookies.token, process.env.SECRET_KEY)
    User.findById(payload.id)
        .then(newUserInfo => {
            if (!newUserInfo) {
                return res.json({});
            }
            res.json({id: newUserInfo._id, email: newUserInfo.email, username: newUserInfo.username});
        })
});

app.post('/register', (req, res) => {
    const { username, email, password, confirmPassword } = req.body;
    if (password!== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }
    // hash the password
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        newUser.save().then(newUserInfo => {
            jwt.sign({id: newUserInfo._id, username: newUserInfo.username, email: newUserInfo.email}, process.env.SECRET_KEY, (err, token) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500).json({ error: 'Internal Server Error' });
                }
                res.cookie('token', token).json({id: newUserInfo._id, username: newUserInfo.username, email: newUserInfo.email});
            })
        });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email })
    .then(userInfo => {
        if (!userInfo) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const passok = bcrypt.compareSync(password, userInfo.password);
        if (passok) {
            jwt.sign({id: userInfo._id, username: userInfo.username, email: userInfo.email}, process.env.SECRET_KEY, (err, token) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500).json({ error: 'Internal Server Error' });
                }
                res.cookie('token', token).json({id: userInfo._id, username: userInfo.username, email: userInfo.email});
            })
        } else {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
    })
})

// save tasks to the database of user id
app.put('/tasks', (req, res) => {
    const payload = jwt.verify(req.cookies.token, process.env.SECRET_KEY)
    const task = new Task({
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        priority: req.body.priority,
        completed: false,
        userId: payload.id
    });
    task.save().then(newTask => {
        res.json(newTask);
    });
});

// get tasks of user id
app.get('/tasks', (req, res) => {
    const payload = jwt.verify(req.cookies.token, process.env.SECRET_KEY)
    Task.find({ userId: payload.id })
       .then(tasks => res.json(tasks))
       .catch(err => console.error(err));
});

// mark tasks as completed
app.post('/tasks', (req, res) => {
    const payload = jwt.verify(req.cookies.token, process.env.SECRET_KEY)
    Task.updateOne({
        _id: req.body.id,
        userId: payload.id
    }, { completed: req.body.completed })
    .then(() => res.sendStatus(200));
});

// delete tasks
app.delete('/tasks/:id', (req, res) => {
    const payload = jwt.verify(req.cookies.token, process.env.SECRET_KEY)
    Task.deleteOne({ _id: req.params.id, userId: payload.id })
    .then(() => res.sendStatus(200));
});

// get todays tasks
app.get('/todays_tasks', (req, res) => {
    const payload = jwt.verify(req.cookies.token, process.env.SECRET_KEY)
    const currentDate = new Date();
    const currentDay = currentDate.toISOString().split('T')[0];
    Task.find({ userId: payload.id, dueDate: currentDay })
       .then(tasks => res.json(tasks))
       .catch(err => console.error(err));
});

// get overdue tasks
app.get('/overdue_tasks', (req, res) => {
    const payload = jwt.verify(req.cookies.token, process.env.SECRET_KEY)
    const currentDate = new Date();
    Task.find({ userId: payload.id, dueDate: { $lt: currentDate.toISOString().split('T')[0] } })
       .then(tasks => res.json(tasks))
       .catch(err => console.error(err));
});

// uncompleted tasks
app.get('/uncompleted_tasks', (req, res) => {
    const payload = jwt.verify(req.cookies.token, process.env.SECRET_KEY)
    Task.find({ userId: payload.id, completed: false })
       .then(tasks => res.json(tasks))
       .catch(err => console.error(err));
});

// completed tasks
app.get('/completed_tasks', (req, res) => {
    const payload = jwt.verify(req.cookies.token, process.env.SECRET_KEY)
    Task.find({ userId: payload.id, completed: true })
       .then(tasks => res.json(tasks))
       .catch(err => console.error(err));
});


//logout
app.post('/logout', (req, res) => {
    res.cookie('token', '').send();
});

// listen at port 4000
app.listen(4000, () => console.log('Server running at port 4000'));