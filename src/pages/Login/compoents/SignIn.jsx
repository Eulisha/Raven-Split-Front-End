import axios from 'axios';
import { useState } from 'react';
import constants from '../../../global/constants';
import { Form, Button, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';

const SignIn = ({ setHasAccount }) => {
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
      console.log(err.response.data.err);
      return Swal.fire({
        title: 'Error!',
        text: err.response.data.err,
        icon: 'error',
        confirmButtonText: 'Cool',
      });
    }
  };

  return (
    <Card className="login-card">
      <Form className="sign-in">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" value={inputValues.email} onChange={handleInput('email')} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={inputValues.password} onChange={handleInput('password')} />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={hanldleSubmit}>
          Submit
        </Button>
        <button className="change-login-method-btn" variant="outline-success" onClick={() => setHasAccount(false)}>
          I don't have account yet
        </button>
      </Form>
    </Card>
  );
};

export default SignIn;
