import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // Importando provider do redux
import './index.css';
import App from './App.jsx';
import store from './redux/store.js'; // Importando uma store

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}> {/*Envolvendo o App com o provider*/}
    <App />
    </Provider>
  </StrictMode>
);

