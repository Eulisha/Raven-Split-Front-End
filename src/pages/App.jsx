import '../index.css';
import { Route, Routes } from 'react-router-dom';
import Login from './Login/compoents/Login';
import Home from './Home/compoents/Home';

const App = () => {
  return (
    <div className="App">
      <Routes className="App">
        <Route id="home_container" element={<Home />} index />
        <Route element={<Login />} path="/login" />
      </Routes>
    </div>
  );
};
export default App;
