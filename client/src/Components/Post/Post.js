import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import axios from '../../axios';
import { useStateValue } from '../../context/StateProvider';
import './Post.css';

function Post({ id , name , title , content, image , likes, commentsArr , userId , userProfileImage, onClick }) {

    const [like , setLike] = useState(false);
    const [likesArray , setLikesArray] = useState([]);
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState('')
    const [showMore, setShowMore] = useState(false)
    const [commentId, setCommentId] = useState('')
    const [userCommentId , setUserCommentId] = useState('')
    const [commentModal, setCommentModal] = useState(null)
    const [textComment, setTextComemnt] = useState('')
    const [{user}] = useStateValue()
    const editCommentModal = useRef(null)
    const editModal = useRef(null)
    const history = useHistory();

    useEffect(() => {
        M.Modal.init(editCommentModal.current);
        setLikesArray([...likes])
        setComments([...commentsArr])
        if(likes.includes(user._id)){
            setLike(true)
        }else{
            setLike(false)
        }
    },[])


    const handleLike = () => {
        if(like){
            setLike(false);
            dislikePost();
        }else{
            setLike(true);
            likePost();
        }
    }

    const likePost = () => {
        axios.put('/like', {
            postId: id
        },{
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        .then(({ data }) => {
            setLikesArray([...data.likes])
        })
        .catch(err => console.log(err)) 
    }

    const dislikePost = () => {
        axios.put('/dislike', {
            postId: id
        },{
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        .then(({data}) => {
            setLikesArray([...data.likes])
        })
        .catch(err => console.log(err))
    }

    const makeComment = (e) => {
        e.preventDefault();
        if(comment === '') return;
        axios.put('/comment',{
            text: comment,
            postId: id
        },{
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        .then(({data}) =>  {
            console.log(data.comments)
            setComments(data.comments);
            setComment('')
        })
        .catch(err => console.log(err))
    }


    const deleteComment = () => {
        axios.delete(`/comment/${commentId}`,{
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        .then(({data}) => {
            console.log(data)
            const updatedComments = comments.filter(comment => comment._id !== data._id)
            setComments(updatedComments)
        })
        .catch(err => console.log(err))
    }

    const editComment = () => {
        console.log(comments)
        const updatedComment = comments.find(comment => comment._id === commentId)
        console.log(updatedComment)
        M.Modal.init(editModal.current);
        setTextComemnt(updatedComment.text)
        setCommentModal(updatedComment)
    }

    const handleUpdatedComment = () => {
        axios.put('/editComment',{
            commentId,
            text: textComment
        },{
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        .then(({data}) => {
            console.log(data)
            const updatedCommentIndex = comments.findIndex(comment => comment._id === data._id)
            console.log(updatedCommentIndex)
            comments[updatedCommentIndex] = data
            setComments([...comments])
        })
        .catch(err => console.log(err))
    }

    return (
        <div className="post">
            <div className="card">
                <div className="card-content post__card--content">       
                    <h4>
                    <div className="post__header">
                        <Link to={ userId === user._id ? '/profile' : `/profile/${userId}`}>
                                <div className="post__userheader">
                                    <img className="post__userImage" src={userProfileImage} alt="user_image"/>
                                    <p className="post__userName">{ name }</p>
                                </div>
                        </Link> 

                        {
                            userId === user._id && (
                                <div className="post__deleteIcon">
                                    <i className="material-icons right" onClick={onClick}>delete</i>
                                </div>
                             )
                        }
                    </div>
                       
                    </h4>
                </div>
                <div className="card-image">
                    <img className="post__cardImage" src={image} alt={title}/>
                </div>
                <div className="post__body">
                    <i className={`material-icons post__like ${like && 'liked--red'}`} onClick={handleLike}>
                        { like ? 'favorite' : 'favorite_border' }
                    </i>
                    <h6>{ likesArray.length } likes</h6>
                    <p className="post__title">{title}</p>
                    <p className="post__content">{content}</p>
                    <form onSubmit={makeComment}>
                        {
                            comments && comments.slice(0,5).map((comment,index) => (
                                <div key={index} className="post__block">
                                    <span className="post__user">{ comment.postedBy?.name }</span>
                                    <span className="post__comment">{ comment.text }</span>
                                    <button 
                                    type="button" 
                                    className={ userId === user._id  ? 'post__commentEdit modal-trigger' : 'hide'} 
                                    data-target="modal1" 
                                    onClick={() => {
                                        setCommentId(comment._id);
                                        setUserCommentId(comment.postedBy._id);
                                    }}>
                                        <svg height="16" width="16" fill="#8e8e8e" viewBox="0 0 48 48">
                                            <circle cx="8" cy="24" r="4.5" fillRule="evenodd" clipRule="evenodd"/>
                                            <circle cx="24" cy="24" r="4.5" fillRule="evenodd" clipRule="evenodd"/>
                                            <circle cx="40" cy="24" r="4.5" fillRule="evenodd" clipRule="evenodd"/>
                                        </svg>
                                    </button>
                                </div>
                            ))
                        } 

                        {
                            comments.length > 5 &&
                            <p 
                            className={showMore ? 'hide' : 'post__showComments'}
                            onClick={() => setShowMore(!showMore)}>
                                More ...
                            </p> 
                        }

                        <div className={showMore ? 'show' : 'hide'}>
                        {
                            comments && comments.slice(5).map((comment,index) => (
                                <div key={index} className="post__block">
                                    <span className="post__user">{ comment.postedBy.name }</span>
                                    <span className="post__comment">{ comment.text }</span>
                                    <button 
                                    type="button" 
                                    className={ userId === user._id ? 'post__commentEdit modal-trigger' : 'hide'}  
                                    data-target="modal1"
                                    onClick={() => {
                                        setCommentId(comment._id);
                                        setUserCommentId(comment.postedBy._id);
                                    }}>
                                        <svg height="16" width="16" fill="#8e8e8e" viewBox="0 0 48 48">
                                            <circle cx="8" cy="24" r="4.5" fillRule="evenodd" clipRule="evenodd"/>
                                            <circle cx="24" cy="24" r="4.5" fillRule="evenodd" clipRule="evenodd"/>
                                            <circle cx="40" cy="24" r="4.5" fillRule="evenodd" clipRule="evenodd"/>
                                        </svg>
                                    </button>
                                </div>
                            )) 
                        }
                            <p 
                            style={{cursor: 'pointer'}}
                            className={showMore ? undefined : 'hide'}
                            onClick={() => setShowMore(!showMore)}>
                                Less ...
                            </p> 
                        </div>
                        
                                    
                        <div id="modal1" className="modal post__modal" ref={editCommentModal}>
                                <div className="modal-content">
                                    <ul className="collection post__collection">
                                        <li 
                                        className={`collection-item post__item center-align modal-close modal-trigger ${userCommentId !== user._id  ? 'hide' : undefined}` }
                                        data-target="modal2" 
                                        onClick={editComment}>
                                            Edit
                                        </li>

                                        <li className="collection-item post__item center-align modal-close" onClick={deleteComment}>Delete</li>
                                        <li className="collection-item post__item center-align modal-close">Cancel</li>
                                    </ul>
                                </div>
                        </div>
                        

                        <div className="input-field">
                            <input 
                            type="text" 
                            placeholder="add a comment" 
                            value={comment} 
                            onChange={e => setComment(e.target.value)}/> 
                        </div>
                    </form>

                    <div id="modal2" className="modal post__modal" ref={editModal}>
                        <div className="modal-content">            
                            <h4>{commentModal?.postedBy.name}</h4>
                            <div className="input-field">
                                <textarea 
                                id="textarea1"
                                value={textComment} 
                                className="materialize-textarea"
                                onChange={e => setTextComemnt(e.target.value)}>
                                </textarea>
                            </div>
                        </div>
                        <div className="modal-footer post__footer">
                            <button  className="modal-close btn waves-effect waves-light post__send blue darken-1" 
                            onClick={handleUpdatedComment}> Submit
                                <i className="material-icons right">send</i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Post;
