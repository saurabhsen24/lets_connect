import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';
import axios from '../../axios';
import { useStateValue } from '../../context/StateProvider';
import './EditProfile.css';

function EditProfile() {
    const [name , setName] = useState('')
    const [email , setEmail] = useState('')
    const [oldPassword , setOldPassword] = useState('')
    const [newPassword , setNewPassword] = useState('')
    const [bio , setBio] = useState('')
    const [{user,token}, dispatch] = useStateValue()
    const history = useHistory()

    useEffect(() => {

        if(!user){
            history.replace('/')
        }else{
            axios.get(`/user/${user?._id}`,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication': `Bearer ${token}`
                }
            })
            .then(({data}) => {
                setName(data.user.name)
                setEmail(data.user.email)
                setBio(data.user.bio)
            })
            .catch(err => {
                console.log(err)
                M.toast({html: err.message})
            })
        }
    },[])

    const handleUpdate = () => {
        axios.put('/updateUser',{
            name,
            email,
            oldPassword,
            newPassword,
            bio
        },{
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${token}`
            }
        })
        .then(({data}) => {
            console.log(data)
            if(data.token){
                dispatch({type: 'SET_TOKEN', token: data.token})
                localStorage.setItem('token', JSON.stringify(data.token))
            }
            dispatch({type: 'SET_USER', user: data.user})
            localStorage.setItem('user', JSON.stringify(data.user))
            history.replace('/profile')
        })
        .catch(err => {
            console.log(err)
            M.toast({html: err.message, classes: '#b71c1c red darken-4'})
        })
    }

    return (
        <div className="editprofile">
            <div className="container z-depth-5">
                <div className="card input-field">
                    <div className="editprofile__card">
                            <div className="card-content">
                                <span className="card-title editprofile__title">Update Profile</span>
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
                            onChange={e => setEmail(e.target.value)}/>

                            <input 
                            placeholder="old password" 
                            type="password" 
                            className="validate"
                            value={oldPassword}
                            onChange={e => setOldPassword(e.target.value)}/>


                            <input 
                            placeholder="new password" 
                            type="password" 
                            className="validate"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}/>
            

                            <div className="input-field">
                                <textarea 
                                id="textarea1"
                                placeholder="Bio"
                                className="materialize-textarea"
                                value={bio}
                                onChange={e => setBio(e.target.value)}>
                                </textarea>
                            </div>
                            
                            <button
                            onClick={handleUpdate}
                            className="waves-effect waves-light btn #64b5f6 blue darken-1">
                                <span><i className="material-icons right">person</i>Update</span>
                            </button>
                    </div>
                </div> 
            </div>  
        </div>
    )
}

export default EditProfile;
