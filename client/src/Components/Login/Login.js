import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import axios from '../../axios';
import { useStateValue } from '../../context/StateProvider';
import './Login.css';

function Login() {

    const [email , setEmail] = useState('')
    const [password , setPassword] = useState('')
    const [{user}, dispatch] = useStateValue();
    const history = useHistory();

    const handleClick = () => {
        axios.post('/login',{
            email,
            password
        },{
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        })
        .then(({data}) => {
            console.log(data)
            dispatch({type: 'SET_USER', user: data.user})
            dispatch({type: 'SET_TOKEN', token: data.token})
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('token', JSON.stringify(data.token))
            history.push('/');
        })
        .catch(err => {
            M.toast({html: 'Invalid email or password' , classes: '#b71c1c red darken-4'})
            console.log(err)
        })
    }

    return (
        <div className="login">
            <div className="card input-field z-depth-5">
                <div className="login__card">
                    <div className="card-content">
                        <span className="card-title login__title">LetsConnect</span>
                    </div>
                    <input 
                        placeholder="email" 
                        type="email" 
                        className="validate"
                        value={email}
                        onChange={e => setEmail(e.target.value)}/>

                    <input 
                        placeholder="password" 
                        type="password" 
                        className="validate"
                        value={password}
                        onChange={e => setPassword(e.target.value)}/>

                    <button 
                    onClick={handleClick}
                    className="waves-effect waves-light btn #64b5f6 blue darken-1">
                        Login
                    </button>
                    
                    <h5>
                        <Link to="/signup">Don't have an account?</Link>
                    </h5>
                </div>
            </div>
        </div>
    )
}

export default Login;
