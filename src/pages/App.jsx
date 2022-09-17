import '../index.css';
import { Route, Routes } from 'react-router-dom';
import Login from './Login/compoents/Login';
import Home from './Home/compoents/Home';
import Header from '../global/Header';
import { useState } from 'react';

const App = () => {
  const [user, setUser] = useState({ uid: null, name: null });
  return (
    <div className="App">
      <Header />
      <Routes className="App">
        <Route id="home_container" element={<Home />} index />
        <Route element={<Login setUser={setUser} />} path="/login" />
      </Routes>
    </div>
  );
};
export default App;
