import { useState, useEffect } from 'react';
import '../index.css';
import GroupUsers from './Home/compoents/GroupUsers';
import { Route, Routes } from 'react-router-dom';
import Login from './Login/compoents/Login';
import Home from './Home/compoents/Home';

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route element={<Home />} paht={'/'}></Route>
      </Routes>
      <Routes>
        <Route element={<Login />} path={'/login'}></Route>;
      </Routes>
    </div>
  );
};
export default App;
