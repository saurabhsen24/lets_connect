import React, { useEffect, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import { useStateValue } from '../../context/StateProvider';
import axios from '../../axios';
import './Header.css';

function Header() {

   const searchModal = useRef(null)
   const [{user},dispatch] = useStateValue();
   const history = useHistory();
   const [search , setSearch] = useState('')
   const [users, setUsers] = useState([])

   useEffect(() => {
        M.Modal.init(searchModal.current)
        if(!user){
            const userData = JSON.parse(localStorage.getItem('user'))
            const token = JSON.parse(localStorage.getItem('token'))
            if(userData && token){
                dispatch({type: 'SET_USER', user: userData})
                dispatch({type: 'SET_TOKEN', token: token})
            }
        }
   },[])

   const fetchUser = (query) => {
       setSearch(query)
        axios.post('/searchUser',{ query },{
            headers: {
                'Content-Type': 'application/json',
                'Authentication': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
            }
        })
        .then(({data}) => {
            console.log(data)
            setUsers(data.users)
        })
        .catch(err => console.log(err))
   }

    const handleLogout = () => {
        localStorage.clear();
        dispatch({type: 'CLEAR'})
        history.push('/login');
    }

    const handleModal = () => {
        M.Modal.getInstance(searchModal.current).close()
        setSearch('')
    }

    const renderList = () => {
        return (
            user ? [
                <li key="1"><i data-target="modal3" className="large material-icons modal-trigger home__search">search</i></li>,
                <li key="2"><Link to="/allpost">All Post</Link></li>,
                <li key="3"><Link to="/profile">Profile</Link></li>,
                <li key="4"><Link to="/createPost">Create Post</Link></li>,
                <li key="5">
                    <button className="waves-effect waves-light btn #64b5f6 blue darken-1" onClick={handleLogout}>Logout</button>
                </li>
            ] : [
                <li key="6"><Link to="/login">Login</Link></li>,
                <li key="7"><Link to="/signup">Signup</Link></li>
            ]
        )
    }

    return (
        <div>
            <nav>
                <div className="nav-wrapper white">
                    <Link to={ user ? '/' : '/login'} className="brand-logo left">LetsConnect</Link>
                    <ul id="nav-mobile" className="right">
                        {
                            renderList()
                        }
                    </ul>
                </div>
                <div id="modal3" className="modal home__modal" ref={searchModal}>
                    <div className="modal-content">
                        <div className="input-field col s12">
                            <input
                            id="input_text" 
                            type="text"
                            value={search}
                            onChange={e => fetchUser(e.target.value)} 
                            placeholder="search"/>
                        </div>
                        <ul className="collection">
                            {
                                users && users.map((item,index) => (
                                    <Link to={ item._id === user._id ? '/profile' : `/profile/${item._id}`} key={index} onClick={handleModal}>
                                        <li className="collection-item home__collectionItem">{item.email}</li>
                                    </Link>
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Header;
