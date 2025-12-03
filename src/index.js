import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './components/Auth/loginmanager';

// Home (App.js)
import App from './App';

// Páginas
import Historia from './components/Pages/historia';
import Instalacoes from './components/Pages/instalacoes';
import Contactos from './components/Pages/contactos';
import Loja from './components/Pages/loja';
import Reservas from './components/Pages/reservas';
import FormSocio from './components/Pages/formsocio';
import Torneios from './components/Pages/torneios';
import Treinos from './components/Pages/treinos';
import Perfil from './components/Pages/perfil';

// Auth
import Login from './components/Auth/login';
import Signup from './components/Auth/signup';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/historia" element={<Historia />} />
          <Route path="/instalacoes" element={<Instalacoes />} />
          <Route path="/contactos" element={<Contactos />} />
          <Route path="/loja" element={<Loja />} />
          <Route path="/reservas" element={<Reservas />} />
          <Route path="/tornar-me-socio" element={<FormSocio />} />
          <Route path="/torneios" element={<Torneios />} />
          <Route path="/treinos" element={<Treinos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </Router>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();