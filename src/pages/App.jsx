import '../index.css';
import { Route, Routes } from 'react-router-dom';
import Login from './Login/compoents/Login';
import Home from './Home/compoents/Home';
import Header from '../global/Header';
import React, { useState } from 'react';

export const User = React.createContext();

const App = () => {
  console.log('@App');
  // if (!localStorage.getItem('accessToken')) {
  const [user, setUser] = useState({});
  console.log('user from setUser:', user);
  // }
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
