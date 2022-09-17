import '../index.css';
import { Route, Routes } from 'react-router-dom';
import Login from './Login/compoents/Login';
import Home from './Home/compoents/Home';
import Header from '../global/Header';
import React, { useState } from 'react';

export const CurrUser = React.createContext();

const App = () => {
  const [user, setUser] = useState({});
  console.log('logging', user);
  return (
    <CurrUser.Provider value={user}>
      <div className="App">
        <Header />
        <Routes className="App">
          <Route id="home_container" element={<Home />} path="/dashboard" />
          <Route element={<Login setUser={setUser} />} path="/login" />
        </Routes>
      </div>
    </CurrUser.Provider>
  );
};
export default App;
