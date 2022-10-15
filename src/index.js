import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import ThemeProvider from 'react-bootstrap/ThemeProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './pages/App.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']} minBreakpoint="xxs">
    <Router>
      <App />
    </Router>
  </ThemeProvider>
);
