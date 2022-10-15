import axios from 'axios';
import { useState, useRef } from 'react';
import constants from '../../../global/constants';
import { Form, Button, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import validator from '../../../global/validator';

const SignUp = ({ setHasAccount }) => {
  //Ref
  const formRef = useRef();

  //State
  const [inputValues, setinputValues] = useState({
    email: '',
    password: '',
    name: '',
    // cellphone: '',
    provider: 'native',
  });

  //Eventhandler
  const handleInput = (prop) => (e) => {
    setinputValues({ ...inputValues, [prop]: e.target.value });
  };

  //Submit
  const hanldleSubmit = async (e) => {
    e.preventDefault();
    e.target.disabled = true;
    const form = formRef.current;
    if (form.reportValidity()) {
      try {
        const { data } = await axios.post(`${constants.API_POST_SIGNUP}`, inputValues);
        localStorage.setItem('accessToken', data.data.accessToken);
        window.location.assign(`${constants.HOST}/dashboard`);
      } catch (err) {
        if (!err.response.data) {
          Swal.fire({
            title: 'Oops!',
            text: 'Network Connection failed, please try later...',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } else if (err.response.data.provider) {
          //後端驗證失敗
          Swal.fire({
            title: 'Error!',
            text: err.response.data.err[0].msg,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } else if (err.response.status == 403) {
          Swal.fire({
            title: 'Error!',
            text: 'Email already existed.',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } else {
          Swal.fire({
            title: 'Error!',
            text: 'Internal Server Error',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        }
      } finally {
        e.target.disabled = false;
      }
    } else {
      validator(formRef);
      e.target.disabled = false;
    }
  };

  return (
    <>
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
          {/* <Form.Group className="mb-3" controlId="formBasicCellPhone"> */}
          {/* <Form.Label>Cell Phone</Form.Label> */}
          {/* <Form.Control required type="tel" placeholder="Cell Phone" value={inputValues.cellphone} title="Cellphone" onChange={handleInput('cellphone')} /> */}
          {/* </Form.Group> */}
          <Button className="sumbit-btn" variant="primary" type="submit" onClick={hanldleSubmit}>
            Submit
          </Button>
          <button type="button" className="change-login-method-btn" style={{ border: 'none' }} onClick={() => setHasAccount(true)}>
            I already have account
          </button>
        </Form>
      </Card>
    </>
  );
};

export default SignUp;
