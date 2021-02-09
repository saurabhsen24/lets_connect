import { useEffect } from 'react';
import {BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import './App.css';
import CreatePost from './Components/CreatePost/CreatePost';
import EditProfile from './Components/EditProfile/EditProfile';
import Header from './Components/Header/Header';
import Home from './Components/Home/Home';
import Login from './Components/Login/Login';
import Profile from './Components/Profile/Profile';
import Signup from './Components/Signup/Signup';
import Allpost from './Components/AllPost/AllPost';
import { useStateValue } from './context/StateProvider';


function App() {

  const Routing = () => {
    const history = useHistory();
    const [state, dispatch] = useStateValue();

    useEffect(() => {
      const userData = JSON.parse(localStorage.getItem('user'));
      const authToken = JSON.parse(localStorage.getItem('token'));
      if(userData && authToken){
        dispatch({type: 'SET_USER', user: userData})
        dispatch({type: 'SET_TOKEN', token: authToken})
      }else{
        history.push('/login');
      }
    },[])

    return (
      <Switch>
        <Route path="/signup">
          <Signup/>
        </Route>

        <Route path="/login">
          <Login/>
        </Route>

        <Route path = '/createPost'>
          <CreatePost/>
        </Route>

        <Route  path = '/profile/:userId'>
          <Profile/>
        </Route>
        
        <Route exact path = '/profile'>
          <Profile/>
        </Route>

        <Route path="/allpost">
            <Allpost/>
        </Route>

        <Route path="/editProfile">
          <EditProfile/>
        </Route>

        <Route exact path='/'>
          <Home/>
        </Route>
      </Switch>
    )

  }

  return (
    <Router>
        <div className="app">
           <Header/>
           <Routing/>
        </div>
    </Router>
  );
}

export default App;
