import { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import './login.css';

const Login = () => {
  const [hasAccount, setHasAccount] = useState(true);
  return (
    <div className="login">
      <img className="login-image" src="https://i.pinimg.com/originals/e4/c0/f9/e4c0f92fa80da7648307aae4a3896a11.gif" />
      {hasAccount ? <SignIn className="sign-in" setHasAccount={setHasAccount} /> : <SignUp className="sign-up" setHasAccount={setHasAccount} />}
    </div>
  );
};

export default Login;
