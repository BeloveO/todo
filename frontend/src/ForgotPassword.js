import { useContext, useState, useEffect } from "react";
import UserContext from "./UserContext";
import { Link, Routes, Route } from "react-router-dom";
import axios from "axios";
import Logo from './images/Logo.jpg';
import Login from './Login';
import Register from './Register';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    function forgotPassword(e) {
        e.preventDefault();

        axios.post('http://localhost:4000/forgot-password', { email })
           .then(response => {
                setSuccess(true);
            })
           .catch(err => {
                setError(err.response.data.error);
            });
    }
}