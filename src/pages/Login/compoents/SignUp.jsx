import axios from 'axios';
import { useState, useRef } from 'react';
import constants from '../../../global/constants';
import { Form, Button, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import validator from '../../../global/validator';

const SignUp = ({ setHasAccount }) => {
  console.log('@Signup');

  const formRef = useRef();
  const [inputValues, setinputValues] = useState({
    email: '',
    password: '',
    name: '',
    cellphone: '',
    provider: 'native',
  });
  // const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  //event handler
  const handleInput = (prop) => (e) => {
    setinputValues({ ...inputValues, [prop]: e.target.value });
  };

  const hanldleSubmit = async (e) => {
    e.preventDefault();
    e.target.disabled = true;
    const form = formRef.current;
    if (form.reportValidity()) {
      try {
        const { data } = await axios.post(`${constants.API_POST_SIGNUP}`, inputValues);
        localStorage.setItem('accessToken', data.data.accessToken);
        // window.location.assign(`${constants.HOST}/dashboard`);
        navigate('/dashboard');
      } catch (err) {
        console.log(err.response.data.err);
        if (err.response.data.provider) {
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
        <Form className="sign-up" noValidate ref={formRef}>
          <Form.Label className="login-title">Sign Up</Form.Label>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control required type="email" placeholder="Enter email" value={inputValues.email} title="Email" onChange={handleInput('email')} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control required type="password" placeholder="Password" value={inputValues.password} title="Password" onChange={handleInput('password')} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Name</Form.Label>
            <Form.Control required type="text" placeholder="Name" name="name" value={inputValues.name} title="Name" onChange={handleInput('name')} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCellPhone">
            <Form.Label>CellPhone</Form.Label>
            <Form.Control required type="tel" placeholder="CellPhone" value={inputValues.cellphone} title="Cellphone" onChange={handleInput('cellphone')} />
          </Form.Group>
          <Button variant="info" type="submit" onClick={hanldleSubmit}>
            Submit
          </Button>
          <button className="change-login-method-btn" variant="outline-success" onClick={() => setHasAccount(false)}>
            I already have account
          </button>
        </Form>
      </Card>
    </div>
  );
};

export default SignUp;
