import '../index.css';
import { Route, Routes } from 'react-router-dom';
import Login from './Login/compoents/Login';
import Home from './Home/compoents/Home';
import Header from '../global/Header';
import React, { useState, useEffect } from 'react';
import constants from '../global/constants';
import axios from 'axios';

export const User = React.createContext();

const App = () => {
  console.log('@App');
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('accessToken');
      const result = await axios.get(constants.API_GET_USER_INFO, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log('fetch data userInfo for setUser: ', result.data.data);
      setUser(result.data.data);
    };
    fetchUserInfo();
  }, []);

  return (
    <User.Provider value={{ user, setUser }}>
      <div className="App">
        <Header />
        <Routes className="App">
          <Route id="home_container" element={<Home />} path="/dashboard" />
          <Route element={<Login />} path="/login" />
        </Routes>
      </div>
    </User.Provider>
  );
};
export default App;
