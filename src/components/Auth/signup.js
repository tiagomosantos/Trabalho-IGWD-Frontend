import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navegador from '../Layout/navegador';
import Footer from '../Layout/footer';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !password2) {
      alert('Preenche todos os campos!');
      return;
    }

    if (password !== password2) {
      alert('As passwords não coincidem!');
      return;
    }

    if (password.length < 6) {
      alert('A password deve ter pelo menos 6 caracteres!');
      return;
    }

    try {
      console.log('📤 Enviando dados:', { username, email, password: '***' });

      const response = await axios.post('http://localhost:8000/api/signup/', {
        username: username,
        email: email,
        password: password,
        password2: password2
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Conta criada:', response.data);
      alert(response.data.message || 'Conta criada com sucesso!');
      navigate('/');
      window.location.reload();

    } catch (error) {
      console.error('❌ Erro:', error.response?.data);

      if (error.response?.data) {
        const errors = error.response.data;
        if (errors.username) {
          alert('Username: ' + errors.username[0]);
        } else if (errors.email) {
          alert('Email: ' + errors.email[0]);
        } else if (errors.password) {
          alert('Password: ' + errors.password[0]);
        } else {
          alert('Erro ao criar conta. Verifica os dados.');
        }
      } else {
        alert('Erro de conexão. Verifica se o backend está a correr.');
      }
    }
  };

  return (
    <div>
      <Navegador />
      <div className="signup-container">
        <div className="signup-box">
          <h2 className="signup-title">Criar Conta</h2>

          <form onSubmit={handleSubmit} className="signup-form">
            <div className="form-group">
              <label className="form-label">Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="form-input"
                placeholder="Escolhe um username"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
                placeholder="teu@email.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                className="form-input"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirmar Password:</label>
              <input
                type="password"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
                minLength="6"
                className="form-input"
                placeholder="Repete a password"
              />
            </div>

            <button type="submit" className="signup-button">
              Criar Conta
            </button>
          </form>

          <p className="signup-footer">
            Já tens conta?{' '}
            <Link to="/login" className="signup-link">
              Faz login aqui
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Signup;