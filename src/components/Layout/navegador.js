import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LoginManager from "../Auth/loginmanager";

function Navegador() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleContactosClick = (e) => {
    e.preventDefault();

    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const contactosSection = document.getElementById('contactos');
        if (contactosSection) {
          contactosSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const contactosSection = document.getElementById('contactos');
      if (contactosSection) {
        contactosSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="navegador">
      <div className="nav-container">
        <Link to="/" className="nav-logo">Padel Club Portugal</Link>

        <ul className="nav-menu">
          <li><Link to="/">Início</Link></li>
          <li><Link to="/treinos">Treinos</Link></li>
          <li><Link to="/torneios">Torneios</Link></li>
          <li><Link to="/reservas">Reservas</Link></li>
          <li><Link to="/loja">Loja</Link></li>
          <li><Link to="/tornar-me-socio">Tornar-me Sócio</Link></li>
          <li><a href="#contactos" onClick={handleContactosClick}>Contactos</a></li>
        </ul>

        <LoginManager />
      </div>
    </nav>
  );
}

export default Navegador;