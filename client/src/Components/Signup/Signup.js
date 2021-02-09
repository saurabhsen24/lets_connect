import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import axios from '../../axios';
import './Signup.css';

function Signup() {

    const [name, setName] = useState('')
    const [email , setEmail] = useState('')
    const [password, setPassword] = useState('')
    const history = useHistory();

    const handleClick = () => {
        axios.post('/signup',{
            name,
            email,
            password
        },{
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            console.log(response);
            history.replace('/login');
        })
        .catch(err => {
            console.log(err.message)
            M.toast({html: 'Email already exists', classes: '#b71c1c red darken-4'})
        })
    }

    return (
        <div className="signup">
            <div className="card input-field z-depth-5">
                <div className="signup__card">
                        <div className="card-content">
                            <span className="card-title signup__title">LetsConnect</span>
                        </div>
                        <input 
                            placeholder="name" 
                            type="text" 
                            className="validate" 
                            value={name} 
                            onChange={e => setName(e.target.value)}/>

                        <input 
                        placeholder="email" 
                        type="email" 
                        className="validate"
                        value={email}
                        onChange={e => setEmail(e.target.value)} />
                       
                        <input 
                        placeholder="password" 
                        type="password" 
                        className="validate"
                        value={password}
                        onChange={e => setPassword(e.target.value)}/>
                        
                        
                        <button
                        onClick={handleClick} 
                        className="waves-effect waves-light btn #64b5f6 blue darken-1">
                            Signup
                        </button>
                        <h5>
                            <Link to="/login">Already have an account?</Link>
                        </h5>
                </div>
            </div>
        </div>
    )
}

export default Signup;
