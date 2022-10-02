import axios from 'axios';
import { useRef, useState } from 'react';
import constants from '../../../global/constants';
import { Form, Button, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import validator from '../../../global/validator';

const SignIn = ({ setHasAccount }) => {
  console.log('@Signin');

  const formRef = useRef();

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
    e.target.disabled = true;
    const form = formRef.current;
    if (form.checkValidity()) {
      try {
        const { data } = await axios.post(`${constants.API_POST_SIGNIN}`, inputValues);
        localStorage.setItem('accessToken', data.data.accessToken);
        window.location.assign(`${constants.HOST}/dashboard`);
      } catch (err) {
        console.log(err.response);
        if (!err.response.data) {
          Swal.fire({
            title: 'Oops!',
            text: 'Something Wrong. Please Try Later.',
            icon: 'error',
            confirmButtonText: 'Cool',
          });
        } else if (err.response.data.provider) {
          //從validator來的error是array形式
          Swal.fire({
            title: 'Error!',
            text: err.response.data.err[0].msg,
            icon: 'error',
            confirmButtonText: 'Cool',
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: err.response.data.err,
            icon: 'error',
            confirmButtonText: 'Cool',
          });
        }
        e.target.disabled = false;
      }
    } else {
      validator(formRef);
      e.target.disabled = false;
    }
  };

  return (
    <div className="login-wrapper">
      <img className="login-image" src="https://i.pinimg.com/originals/e4/c0/f9/e4c0f92fa80da7648307aae4a3896a11.gif" />
      <Card className="login-card">
        <Form className="sign-in" noValidate ref={formRef}>
          <Form.Label className="login-title">Sign In</Form.Label>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control required type="email" placeholder="Enter email" value={inputValues.email} title="Email" onChange={handleInput('email')} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control required type="password" placeholder="Password" value={inputValues.password} title="Password" onChange={handleInput('password')} />
          </Form.Group>
          <Button className="sumbit-btn" variant="primary" type="submit" onClick={hanldleSubmit}>
            Submit
          </Button>
          <button className="change-login-method-btn" variant="outline-success" onClick={() => setHasAccount(false)}>
            I don't have account yet
          </button>
        </Form>
      </Card>
    </div>
  );
};

export default SignIn;
