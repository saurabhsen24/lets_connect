import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../axios';
import Post from '../Post/Post';
import './AllPost.css';

function AllPost() {

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        
        axios.get('/allpost', {
            'Content-Type': 'application/json',
            headers: {
                'Authentication': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        .then(({data}) => {
            console.log(data)
            setPosts(data.posts)
        })
        .catch(err => console.log(err))
    },[])

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

    return (
        <div className="allpost">
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
                        userProfileImage={post.postedBy.pic}
                        onClick={() => handleDeletePost(post._id)}
                    />
                )) : (
                        <div className="card all__card z-depth-4">
                            <div className="card-content">
                            <h3 className="flow-text">
                                Please post something so anyone can see your post and follow you and make new friends.
                            </h3>
                            </div>    
                            <Link to="/profile">
                                <button className="btn blue darken-1 #64b5f6 waves-effect waves-light">Profile</button> 
                            </Link>
                        </div>  
                )
            }        
        </div>
    )
}

export default AllPost;
