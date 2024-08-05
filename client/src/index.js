import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthLogin } from './AuthComponents/AuthLogin';

ReactDOM.render(
  <AuthLogin>
    <App />
  </AuthLogin>
    ,document.getElementById('root'));
    // registerServiceWorker();
