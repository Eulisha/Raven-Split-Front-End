import SignIn from './SignIn';
import SignUp from './SignUp';

const Login = ({ setUser }) => {
  return (
    <div id="login">
      <SignIn setUser={setUser} />
      <SignUp setUser={setUser} />
    </div>
  );
};

export default Login;
