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
    const fetchUserInfo = async () => {
      console.log('here');
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.log('no token');
          Swal.fire({
            title: 'Error!',
            text: 'Please login first',
            icon: 'error',
            confirmButtonText: 'Cool',
          });
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
        Swal.fire({
          title: 'Error!',
          text: err.response.data.err,
          icon: 'error',
          confirmButtonText: 'Cool',
        });
        return navigate('/login');
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
    </User.Provider>
  );
};
export default App;
