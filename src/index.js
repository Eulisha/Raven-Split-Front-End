import React from 'react'; //類似JQuery
import ReactDOM from 'react-dom/client'; //畫畫面的
import './index.css';
import App from './pages/Home/App.jsx'; //檔名是index.js的話路徑上可以省略

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
