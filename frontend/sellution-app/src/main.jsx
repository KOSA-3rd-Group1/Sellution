import React from 'react';
import ReactDOM from 'react-dom/client';
import Modal from 'react-modal';

import { CookiesProvider } from 'react-cookie';

import App from './App.jsx';
import './index.css';

// 애플리케이션의 루트 요소를 지정합니다.
Modal.setAppElement('#root');

ReactDOM.createRoot(document.getElementById('root')).render(
  <CookiesProvider>
    <App />
  </CookiesProvider>,
);
