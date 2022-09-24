import axios from 'axios';
import { useState } from 'react';
import constants from '../../../global/constants';

const SignUp = () => {
  console.log('@Signup');

  const [inputValues, setinputValues] = useState({
    email: '',
    password: '',
    name: '',
    cellphone: '',
    provider: 'native',
  });
  // const [submitted, setSubmitted] = useState(false);

  //event handler
  const handleInput = (prop) => (e) => {
    setinputValues({ ...inputValues, [prop]: e.target.value });
  };

  const hanldleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${constants.API_POST_SIGNUP}`, inputValues);
      localStorage.setItem('accessToken', data.data.accessToken);
      window.location.assign(`${constants.HOST}/dashboard`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form id="sign-up">
      SignUp
      <label>
        Email
        <input id="email" type="email" name="email" value={inputValues.email} onChange={handleInput('email')} />
      </label>
      <label>
        Password
        <input id="password" type="password" name="password" value={inputValues.password} onChange={handleInput('password')} />
      </label>
      <label>
        Name
        <input id="name" type="text" name="name" value={inputValues.name} onChange={handleInput('name')} />
      </label>
      <label>
        CellPhone
        <input id="cellphone" type="text" name="cellphone" value={inputValues.cellphone} onChange={handleInput('cellphone')} />
      </label>
      <button onClick={hanldleSubmit}>Submit</button>
    </form>
  );
};

export default SignUp;
