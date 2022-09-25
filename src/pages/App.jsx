import '../index.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './Login/compoents/Login';
import Home from './Home/compoents/Home';
// import Header from '../global/Header';
import React, { useState, useEffect } from 'react';
import constants from '../global/constants';
import axios from 'axios';
// import './style.scss';
import '@coreui/coreui/dist/css/coreui.min.css';
import { Alert } from '@mui/material';

export const User = React.createContext();

const App = () => {
  console.log('@App');
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      console.log('here');
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.log('no token');
          setShowAlert(true);
          // alert('Please Log In First!');
          navigate('/login');
          return;
        }

        const { data } = await axios.get(constants.API_GET_USER_INFO, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        console.log('BACKEND for setUser: ', data.data);
        setUser(data.data);
      } catch (err) {
        console.log(err.response.data.err);
        <Alert severity="error">{err.response}</Alert>;
        navigate('/login');
      }
    };
    if (window.location.href !== `${constants.HOST}/login`) {
      console.log('in');
      fetchUserInfo();
    }
  }, []);

  return (
    <User.Provider value={{ user, setUser }}>
      <div className="App">
        <Routes className="App">
          <Route id="home_container" element={<Home user={user} />} path="/dashboard" />
          <Route element={<Login />} path="/login" />
        </Routes>
      </div>
      <Alert severity="error" show={showAlert}>
        Please Log In First!
      </Alert>
    </User.Provider>
  );
};
export default App;
