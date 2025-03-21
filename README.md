# Todo Application

## Overview

This is a full-stack task management application built with React for frontend, and Express, MongoDB and NodeJS for the backend. This application allows for users' registration, profile creation and login. The users can from there manage their tasks. They can create, edit, delete and mark tasks as complete. The app also includes features like password reset, username change, account deletion, and tasks filtering (e.g., today's tasks, overdue tasks, completed tasks).

## Features

### User Authentication

- **Register**: Users can create an account by providing a username, email, and a password which would be encrypted.
- **Login**: Users can log in using their email and password.
- **Password Validation**: User passwords are bound by some constraints such as presence of uppercase, lowercase, numeric and special characters. At the same time, paswword is not allowed to be less than 6 characters for further encryption.
- **Password Reset**: Users can request a password reset link via email and set a new password.
- **Settings**: Here you can make changes to the user's account like:
  - **Username Update**: After login, users can change their username to new ones of their choice in the settings page.
  - **Password Change**: After login, users can change their passwords freely in the settings page.
  - **Profile Deletion**: User can delete their entire account after a confirmation.

### Task Management

- **Create New tasks**: Users can add new tasks with a title, optional description and an optional due date.
- **Edit Tasks**: Users can edit any part of their existing tasks so far it is not completed.
- **Delete Tasks**: Users can delete tasks they no longer need.
- **Mark as Completed**: Users can mark their completed tasks as thus.
- **Tasks Filtering**: Tasks are filtered into the following categories automatically...
  - **All Tasks**: View all tasks regardless of them being complete or not.
  - **Today's Tasks**: View tasks due today.
  - **Overdue Tasks**: View tasks that are past their due date.
  - **Completed Tasks**: View tasks that have been marked as completed.
  - **Uncompleted Tasks**: View tasks that are still pending.

### Error Handling

- Displays user-friendly error messages for invalid inputs, failed authentication, and server errors.

## Technologies Used

### Frontend

- **React**: JavaScript library for building the user interface.
- **React Router**: For navigation between pages.
- **Axios**: For making HTTP requests to the backend.
- **Context API**: For managing global state (e.g., user authentication).

### Backend

- **NodeJS**: JavaScript runtime for the server.
- **Express**: Web framework for building the REST API.
- **MongoDB**: NoSQL database for storing user and task data.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB.
- **JSON Web Token**: For user authentication and authorization.
- **Nodemailer**: For sending password reset emails.
- **Bcrypt**: For hashing passwords.
- **BodyParser**: To parse incoming request bodies.
- **CookieParser**: To simplify cookie handling.
- **Cors**: To allow for secure cross origin resourse sharing.