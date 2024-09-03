import React from 'react';
import ReactDOM from 'react-dom/client';
import Header from './Header'
import reportWebVitals from './reportWebVitals';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import 'sweetalert2/dist/sweetalert2.min.css';

import './index.css';


import { Provider } from 'react-redux';
import store from './ReduxStore';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <Header/>
    </Provider>
);


reportWebVitals();
