import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from 'App';
import 'semantic-ui-css/semantic.min.css';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
// import { Web3Provider } from 'react-web3';

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'));
registerServiceWorker();
