import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navegador from "../Layout/navegador";
import Footer from "../Layout/footer";
import { api } from "../../api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.login({ username, password });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao fazer login");
    }
  };

  return (
    <>
      <Navegador />
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <h1>Bem-vindo de volta!</h1>
            <p>Faz login para continuares</p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nome de utilizador:</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="O teu nome de utilizador"
                />
              </div>

              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="A tua password"
                />
              </div>

              <button type="submit" className="btn-submit">
                Entrar
              </button>
            </form>

            <div className="auth-link">
              Ainda não tens conta? <Link to="/signup">Cria uma aqui</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Login;