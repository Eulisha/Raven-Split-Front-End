import axios from 'axios';
import { useState } from 'react';
import constants from '../../../global/constants';

const SignIn = () => {
  console.log('@Signin');

  const [inputValues, setinputValues] = useState({
    email: '',
    password: '',
    provider: 'native',
  });

  //event handler
  const handleInput = (prop) => (e) => {
    setinputValues({ ...inputValues, [prop]: e.target.value });
  };

  const hanldleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${constants.API_POST_SIGNIN}`, inputValues);
      localStorage.setItem('accessToken', data.data.accessToken);
      window.location.assign(`${constants.HOST}/dashboard`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form id="sign-in">
      SignIn
      <label>
        Email
        <input id="email" type="email" name="email" value={inputValues.email} onChange={handleInput('email')} />
      </label>
      <label>
        Password
        <input id="password" type="password" name="password" value={inputValues.password} onChange={handleInput('password')} />
      </label>
      <button onClick={hanldleSubmit}>Submit</button>
    </form>
  );
};

export default SignIn;
