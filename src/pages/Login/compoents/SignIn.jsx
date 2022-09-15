import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import constants from '../../../global/constants';

const SignIn = () => {
  const [inputValues, setinputValues] = useState({
    email: '',
    password: '',
    provider: 'native',
  });
  const [submitted, setSubmitted] = useState(false);

  //event handler
  const handleInput = (prop) => (e) => {
    setinputValues({ ...inputValues, [prop]: e.target.value });
  };
  const hanldleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  //submit form
  useEffect(() => {
    try {
      if (submitted) {
        //fetch sigin
        const fetchSigIn = async () => {
          const { data } = await axios.post(
            `${constants.API_POST_SIGNIN}`,
            inputValues
          );
          //set local storage
          localStorage.setItem('accessToken', data.data.accessToken);
        };
        fetchSigIn();
      }
    } catch (err) {
      console.log(err);
    }
  }, [submitted]);
  return (
    <form id="sign-in">
      {' '}
      SignIn
      <label>
        {' '}
        Email
        <input
          id="email"
          type="email"
          name="email"
          value={inputValues.email}
          onChange={handleInput('email')}
        />
      </label>
      <label>
        {' '}
        Password
        <input
          id="password"
          type="password"
          name="password"
          value={inputValues.password}
          onChange={handleInput('password')}
        />
      </label>
      <button onClick={hanldleSubmit}>Submit</button>
    </form>
  );
};

export default SignIn;
