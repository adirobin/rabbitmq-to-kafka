import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <div>
        <small>You are running this application in <b>-{process.env.NODE_ENV}-</b> mode. your backend URL is: {process.env.REACT_APP_API_URL}</small>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </div>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
