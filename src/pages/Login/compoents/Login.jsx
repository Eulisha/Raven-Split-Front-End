import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignIn from './SignIn';
import SignUp from './SignUp';
import './login.css';

const Login = () => {
  const [hasAccount, setHasAccount] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/dashboard');
    }
  }, []);

  return <div className="login">{hasAccount ? <SignIn className="sign-in" setHasAccount={setHasAccount} /> : <SignUp className="sign-up" setHasAccount={setHasAccount} />}</div>;
};

export default Login;
