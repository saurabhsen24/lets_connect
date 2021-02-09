import axios from '../../axios';
import React, { useEffect, useState } from 'react';
import './CreatePost.css';
import { useHistory } from 'react-router-dom';

function CreatePost() {

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [image , setImage] = useState('')
    const [url, setUrl] = useState('')
    const history = useHistory();

    useEffect(() => {
        if(url){
            axios.post('/createPost',{
                title,
                content,
                photo: url
            },{
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication': `Bearer ${JSON.parse(localStorage.getItem('token'))}` 
                }
            })
            .then(response =>  {
                history.replace('/allpost')
            })
            .catch(err => console.log(err))
        }
    },[url])

    const postDetails = () => {
        const data = new FormData()
        data.append('file', image)
        data.append('upload_preset', 'letsconnect')
        data.append('cloud_name', 'darkslasher')
        fetch('https://api.cloudinary.com/v1_1/darkslasher/image/upload',{
            method: 'post',
            body: data
        })
        .then(response => response.json())
        .then(data => {
            setUrl(data.url)
        })
        .catch(err => console.log(err))
    }

    return (
        <div className="createPost">
            <div className="card input-field ">
                <div className="createPost__card">
                        <div className="card-content">
                            <span className="card-title createPost__title">Create Post</span>
                        </div>
                        <input 
                            placeholder="title" 
                            type="text" 
                            value={title} 
                            onChange={e => setTitle(e.target.value)}/>

                        <input 
                            placeholder="content" 
                            type="text" 
                            value={content} 
                            onChange={e => setContent(e.target.value)}/>
                        

                        <div className="file-field input-field">
                            <div className="btn #64b5f6 blue darken-1">
                                <span>Upload Image</span>
                                <input type="file" onChange={e => setImage(e.target.files[0])} />
                            </div>
                            <div className="file-path-wrapper">
                                <input className="file-path validate" type="text" placeholder="Upload File" value={image.name}/>
                            </div>
                        </div>

                        
                        <button
                        onClick={postDetails}
                        className="waves-effect waves-light btn #64b5f6 blue darken-1">
                            Submit Post
                        </button>
                </div>
            </div>   
        </div>
    )
}

export default CreatePost;
