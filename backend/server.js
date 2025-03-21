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
import { UTCDate } from "@date-fns/utc";
import nodemailer from 'nodemailer';


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

// Nodemailer configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.APP_PASSWORD,
    },
});


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
    Task.find({ userId: payload.id, completed: false })
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
    const payload = jwt.verify(req.cookies.token, process.env.SECRET_KEY);
    const currentDate = new Date();
    const currentDay = currentDate.toUTCString();
    Task.find({ userId: payload.id, dueDate: currentDay, completed: false })
       .then(tasks => res.json(tasks))
       .catch(err => console.error(err));
});

// get overdue tasks
app.get('/overdue_tasks', (req, res) => {
    const payload = jwt.verify(req.cookies.token, process.env.SECRET_KEY)
    const currentDate = new UTCDate();
    Task.find({ userId: payload.id, dueDate: { $lt: currentDate, $exists: true, $ne: "" }, completed: false })
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

// edit tasks
app.put('/tasks/:id', (req, res) => {
    const payload = jwt.verify(req.cookies.token, process.env.SECRET_KEY)
    Task.updateOne({ _id: req.params.id, userId: payload.id }, { $set: req.body })
       .then(() => res.sendStatus(200));
});

// go to settings page
app.get('/settings', (req, res) => {
    const payload = jwt.verify(req.cookies.token, process.env.SECRET_KEY)
    User.findById(payload.id)
       .then(userInfo => res.json(userInfo));
});


// change username
app.put('/user', (req, res) => {
    const payload = jwt.verify(req.cookies.token, process.env.SECRET_KEY)
    User.updateOne({ _id: payload.id }, { $set: { username: req.body.username } })
       .then(() => res.sendStatus(200));
});


// forgot password
app.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        // Generate a JWT reset token with a 15-minute expiry
        const resetToken = jwt.sign(
            { id: user._id }, // Payload
            process.env.JWT_SECRET_KEY, // Secret key
            { expiresIn: "15m" } // Token expiry
        );

        // Save the reset token to the user document
        user.resetPasswordToken = resetToken;
        await user.save();

        // Send email with reset link
        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        const mailOptions = {
            to: email,
            from: process.env.EMAIL,
            subject: 'Password Reset',
            html: `
                <h1>Reset Your Password</h1>
                <p>Click on the following link to reset your password:</p>
                <a href="${resetUrl}"><button>Reset Password</button></a>
                <p>The link will expire in 15 minutes.</p>
                <p>If you didn't request a password reset, please ignore this email.</p>
            `,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Password reset email sent." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "An error occurred. Please try again." });
    }
});


// Handle reset password submission
app.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id; // Extract user ID from token payload

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token." });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match." });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password and clear the reset token
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        await user.save();

        res.status(200).json({ message: "Password reset successfully." });
    } catch (err) {
        console.error(err);
        if (err.name === "TokenExpiredError") {
            return res.status(400).json({ error: "Token has expired." });
        }
        if (err.name === "JsonWebTokenError") {
            return res.status(400).json({ error: "Invalid token." });
        }
        res.status(500).json({ error: "An error occurred. Please try again." });
    }
});


// update password
app.put('/user/change_password', (req, res) => {
    const payload = jwt.verify(req.cookies.token, process.env.SECRET_KEY)
    User.findById(payload.id)
    bcrypt.hash(req.body.newPassword, 10, (err, hashedPassword) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        User.updateOne({ _id: payload.id }, { password: hashedPassword })
           .then(() => res.sendStatus(200));
    })
})


// delete account
app.delete('/user', (req, res) => {
    const payload = jwt.verify(req.cookies.token, process.env.SECRET_KEY)
    User.deleteOne({ _id: payload.id }, )
       .then(() => res.sendStatus(200));
});


//logout
app.post('/logout', (req, res) => {
    res.cookie('token', '').send();
});

// listen at port 4000
app.listen(4000, () => console.log('Server running at port 4000'));