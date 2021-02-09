import React, { useEffect, useState } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom';
import axios from '../../axios';
import { useStateValue } from '../../context/StateProvider';
import Post from '../Post/Post';
import './Profile.css';


function Profile() {

    const [posts, setPosts] = useState([])
    const [userProfile , setUserProfile] = useState({})
    const [follow, setFollow] = useState(false)
    const [{user,token},dispatch] = useStateValue()
    const { userId } = useParams()
    const history = useHistory()

    useEffect(() => {
        if(!user){
            history.replace('/');
        }else{
            getUserData()
        }
    },[userId])


    const getUserData = () => {
        console.log(userId)
        const id = userId ? userId : user._id

        axios.get(`/user/${id}`,{
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${token}`
            }
        })
        .then(({data}) => {
            setPosts(data.posts)
            setUserProfile(data.user)
            if(data.user.followers.includes(user._id)){
                setFollow(false)
            }else{
                setFollow(true)
            }
        })
        .catch(err => console.log(err))
    }

    const handleDeletePost = (id) => {
        axios.delete(`/deletePost/${id}`,{
            headers: {
                'AUthentication': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        .then(({data}) => {
            const updatedPosts = posts.filter(post => post._id !== data._id)
            setPosts(updatedPosts)
        })
        .catch(err => console.log(err))
    }


    const handleUnfollow = () => {
        axios.put('/unfollow',{
            unfollowId: userId
        },{
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${token}`
            }
        })
        .then(({data}) => {
            setUserProfile(data)
            setFollow(true)
        })
        .catch(err => console.log(err))  
    }

    const handleFollow = () => {
        axios.put('/follow',{
            followId: userId
        },{
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${token}`
            }
        })
        .then(({data}) => {
            setUserProfile(data)
            setFollow(false)
        })
        .catch(err => console.log(err))
    }

    const uploadPhoto = (file) => {
        console.log(file)
        const data = new FormData()
        data.append('file', file)
        data.append('upload_preset', 'letsconnect')
        data.append('cloud_name', 'darkslasher')
        fetch('https://api.cloudinary.com/v1_1/darkslasher/image/upload',{
            method: 'post',
            body: data
        })
        .then(response => response.json())
        .then(({url}) => {
            axios.put('/uploadpic', {
                pic: url
            },{
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication': `Bearer ${token}`
                }  
            })
            .then(({data}) => {
                console.log(data)
                setUserProfile(data)
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    }

    const deleteUserAccount = () => {
        axios.delete(`/user/${user._id}`,{
            headers: {
                'Authentication': `Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response);
            localStorage.clear();
            dispatch({type: 'CLEAR'})
            history.replace('/login');
        })
        .catch(err => console.log(err))
    }

    return (
      <div className="profile">
            <div className="container">
                <div className="row">

                    <div className="col m4 s6">
                        <img 
                            className="profile__image"
                            src={userProfile?.pic} 
                            alt=""/>
                    </div>

                    <div className="col m8 s6">
                        <div className="profile__username">{userProfile?.name}</div>
                        <div className="profile__userdata row">
                              <div className="col s4"><span className="profile__number">{posts.length}</span> posts</div> 
                              <div className="col s4"><span className="profile__number">{userProfile?.followers?.length}</span> followers</div> 
                              <div className="col s4"><span className="profile__number">{userProfile?.following?.length}</span> following</div>  
                        </div>
                        
                        <div className="row profile__userInfo">

                            <div className="col s12">
                                <button
                                onClick={() => { follow ? handleFollow() : handleUnfollow() }} 
                                className={`waves-effect waves-light btn blue darken-1 ${!userId && 'hide'}`}>
                                    { follow ? 'Follow' : 'Unfollow'}
                                </button>
                            </div>   
                            {                            
                                userProfile?.bio !== '' &&    
                                <div className="profile__bio col s12">
                                    <h6>Bio</h6>
                                    <p>{ userProfile?.bio }</p>
                                </div>
                            }  
                                             
                        </div>

                        <div className="row profile__buttons hide-on-small-only">       
                            <button 
                            className={ 
                                ((userId && userId === user?._id) || !userId) 
                                ? "waves-effect waves-light btn blue darken-1 left" : "hide"
                            }>
                                <Link to="/editProfile">
                                    <span>
                                        <span style={{color: 'white'}}><i className="material-icons right" style={{color: 'white'}}>edit</i>
                                            Edit
                                        </span>
                                    </span>
                                </Link>
                            </button>

                            <div 
                            onClick={deleteUserAccount}
                            className={ ((userId && userId === user?._id) || !userId)
                                 ? "btn #b71c1c red darken-4 file-field input-field right" : "hide"
                                }
                            style={{marginTop: 0}}>
                                <span><i className="material-icons right">delete</i>Account</span>
                            </div>

                            <div 
                            className={ ((userId && userId === user?._id) || !userId)
                                 ? "btn #64b5f6 blue darken-1 file-field input-field right" : "hide"
                                }
                            style={{marginTop: 0}}>
                                <span><i className="material-icons right">camera_alt</i>Upload</span>
                                <input type="file" onChange={e => uploadPhoto(e.target.files[0])}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row profile__buttons hide-on-med-and-up">       
                            <button 
                            className={ 
                                ((userId && userId === user?._id) || !userId) 
                                ? "waves-effect waves-light btn blue darken-1 left" : "hide"
                            }>
                                <Link to="/editProfile">
                                    <span>
                                        <span style={{color: 'white'}}><i className="material-icons right" style={{color: 'white'}}>edit</i>
                                            Edit
                                        </span>
                                    </span>
                                </Link>
                            </button>

                            <div 
                            onClick={deleteUserAccount}
                            className={ ((userId && userId === user?._id) || !userId)
                                 ? "btn #b71c1c red darken-4 file-field input-field right" : "hide"
                                }
                            style={{marginTop: 0}}>
                                <span><i className="material-icons right">delete</i>Account</span>
                            </div>

                            <div 
                            className={ ((userId && userId === user?._id) || !userId)
                                 ? "btn #64b5f6 blue darken-1 file-field input-field right" : "hide"
                                }
                            style={{marginTop: 0}}>
                                <span><i className="material-icons right">camera_alt</i>Upload</span>
                                <input type="file" onChange={e => uploadPhoto(e.target.files[0])}/>
                            </div>
                </div>

                <div className="row">
                    {
                        posts.length > 0 ? posts.map(post => (
                            <Post
                                key={post._id}
                                id={post._id}
                                name={post.postedBy.name}
                                title={post.title}
                                content={post.content}
                                image={post.photo}
                                likes={post.likes}
                                commentsArr={post.comments}
                                userId={post.postedBy._id}
                                userProfileImage={userProfile?.pic}
                                onClick={() => handleDeletePost(post._id)}
                            />
                        )) : (

                        <div className="card profile__card z-depth-4">
                            <div className="card-content">
                            <h3 className="flow-text">
                                { userId ? userProfile.name : 'You' } didn't post anything yet.
                            </h3>
                            </div>    
                            <Link to="/createPost">
                                <button className="btn blue darken-1 #64b5f6 waves-effect waves-light">Create Post</button> 
                            </Link>
                        </div>  
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Profile;
