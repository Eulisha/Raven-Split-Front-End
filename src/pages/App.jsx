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
import Swal from 'sweetalert2';

export const User = React.createContext();

const App = () => {
  console.log('@App');
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    console.log('href', window.location.href);
    if (!token) {
      console.log('no token');
      navigate('/');
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const { data } = await axios.get(constants.API_GET_USER_INFO, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        console.log('BACKEND for setUser: ', data.data);
        setUser(data.data);
      } catch (err) {
        console.log(err.response.data.err);
        Swal.fire({
          title: 'Error!',
          text: err.response.data.err,
          icon: 'error',
          confirmButtonText: 'Cool',
        }).then(() => {
          localStorage.removeItem('accessToken');
          navigate('/');
          return;
        });
        return;
      }
    };
    if (window.location.href !== `${constants.HOST}`) {
      fetchUserInfo();
    }
  }, []);

  return (
    <User.Provider value={{ user, setUser }}>
      <div className="App">
        <Routes className="App">
          <Route id="home_container" element={<Home user={user} />} path="/dashboard" />
          <Route element={<Login />} path="/" />
        </Routes>
      </div>
    </User.Provider>
  );
};
export default App;
