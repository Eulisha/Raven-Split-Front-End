import axios from 'axios';
import { useRef, useState } from 'react';
import constants from '../../../global/constants';
import { Form, Button, Card } from 'react-bootstrap';
import Swal from 'sweetalert2';
import validator from '../../../global/validator';

const SignIn = ({ setHasAccount }) => {
  //Ref
  const formRef = useRef();

  //State
  const [inputValues, setinputValues] = useState({
    email: 'guest@raven-split.life',
    password: '12345678',
    provider: 'native',
  });

  //Eventhandler
  const handleInput = (prop) => (e) => {
    setinputValues({ ...inputValues, [prop]: e.target.value });
  };

  //Eventhandler
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
        if (!err.response.data) {
          Swal.fire({
            title: 'Oops!',
            text: 'Network Connection failed, please try later...',
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } else if (err.response.data.provider) {
          //後端驗證錯誤
          Swal.fire({
            title: 'Error!',
            text: err.response.data.err[0].msg,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        } else if (err.response.status == 403) {
          Swal.fire({
            title: 'Error!',
            text: 'Please check e-mail and password are correct.',
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
    <div className="login-wrapper">
      <img className="login-image" src="/raven.gif" alt="raven" />
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
          <button className="change-login-method-btn" style={{ border: 'none' }} onClick={() => setHasAccount(false)}>
            I don't have account yet
          </button>
        </Form>
      </Card>
    </div>
  );
};

export default SignIn;
