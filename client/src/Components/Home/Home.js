import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../axios';
import Post from '../Post/Post';
import './Home.css';

function Home() {
    
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        axios.get('/subposts', {
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

    return (
        <div className="home">
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
                    />
                )) :
                <div className="card home__card z-depth-4">
                    <div className="card-content">
                    <h3 className="flow-text">
                        Please follow people or friends to get Subscribed Post.
                        Click on below button to see posts and follow or you can search your friends and follow them
                    </h3>
                    </div>    
                    <Link to="/allpost">
                        <button className="btn blue darken-1 #64b5f6 waves-effect waves-light">All Post</button> 
                    </Link>
                </div>    
            }
        </div>
    )
}

export default Home;
