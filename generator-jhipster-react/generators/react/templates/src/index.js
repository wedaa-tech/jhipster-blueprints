import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
<%_ if (oauth2) { _%>
import { AuthProvider } from "react-oidc-context";
<%_ } _%>

<%_ if (oauth2) { _%>
const oidcConfig = {
    authority: process.env.REACT_APP_OIDC_AUTHORITY,
    client_id: process.env.REACT_APP_OIDC_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_PROJECT_URL,
    // ...
  };
<%_ } _%>

<%_ if (oauth2) { _%>
const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <AuthProvider {...oidcConfig}>
      <App />
    </AuthProvider>
  );
<%_ } else { _%>
const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
<%_ } _%>

  // If you want to start measuring performance in your app, pass a function
  // to log results (for example: reportWebVitals(console.log))
  // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
  reportWebVitals();
