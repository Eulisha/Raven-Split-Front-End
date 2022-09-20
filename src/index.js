import React from 'react'; //類似JQuery
import ReactDOM from 'react-dom/client'; //畫畫面的
import { BrowserRouter as Router } from 'react-router-dom';
import ThemeProvider from 'react-bootstrap/ThemeProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './pages/App.jsx'; //檔名是index.js的話路徑上可以省略
{
  /* <link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css"
  integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor"
  crossorigin="anonymous"
/>; */
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ThemeProvider breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']} minBreakpoint="xxs">
    <Router>
      <App />
    </Router>
  </ThemeProvider>
);
