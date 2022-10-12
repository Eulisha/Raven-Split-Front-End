import '../index.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './Login/compoents/Login';
import Home from './Home/compoents/Home';
import React, { useState, useEffect } from 'react';
import constants from '../global/constants';
import axios from 'axios';
import '@coreui/coreui/dist/css/coreui.min.css';
import Swal from 'sweetalert2';

export const User = React.createContext();

const App = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) {
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
        setUser(data.data);
      } catch (err) {
        if (!err.response.data) {
          //網路錯誤
          Swal.fire({
            title: 'Oops!',
            text: 'Network Connection failed, please try later...',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            title: 'Please sign in first.',
            icon: 'warning',
            showConfirmButton: false,
            timer: 1000,
          }).then(() => {
            localStorage.removeItem('accessToken');
            navigate('/');
            return;
          });
        }
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
