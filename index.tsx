import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AdminAccess from './components/AdminAccess';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {window.location.pathname === '/catalogo'
      ? <App />
      : <AdminAccess><App /></AdminAccess>}
  </React.StrictMode>
);
