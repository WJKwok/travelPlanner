import ReactDOM from 'react-dom';
import './Styles/index.scss';
import 'semantic-ui-css/semantic.min.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import ApolloProvider from './ApolloProvider';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(ApolloProvider, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();