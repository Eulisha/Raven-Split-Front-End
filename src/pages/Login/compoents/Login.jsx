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

  return (
    <div className="login">
      <div className="login-wrapper">
        <div className="login-image-wrapper">
          <img className="login-image" src="/raven.gif" alt="raven" />
          <div className="login-welcome">
            <span className="login-welcome-title">Welcom to Raven Split</span>
            <span className="login-welcome-text">A place to easily record shared expenses in groups</span>
          </div>
        </div>
        {hasAccount ? <SignIn className="sign-in" setHasAccount={setHasAccount} /> : <SignUp className="sign-up" setHasAccount={setHasAccount} />}
      </div>
    </div>
  );
};

export default Login;
