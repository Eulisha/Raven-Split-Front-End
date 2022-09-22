import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import constants from './constants';
import { FaCrow } from 'react-icons/fa';

const Header = () => {
  //profile
  //log out
  //create group=
  return (
    <Navbar className="header" bg="light" expand="lg">
      <Container>
        <div className="header-logo">
          <Navbar.Brand href="/dashboard">Raven Split</Navbar.Brand>
          <FaCrow size={40} />
        </div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="header-navbar">
          <Nav className="me-auto">
            <NavDropdown title="My Account" id="basic-nav-dropdown">
              {/* <NavDropdown.Item href="#action/3.1">Account Setting</NavDropdown.Item> */}
              <NavDropdown.Divider />
              <NavDropdown.Item
                onClick={() => {
                  localStorage.removeItem('accessToken');
                  window.location.assign(`${constants.HOST}/login`);
                }}
              >
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
