import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navegador from "../Layout/navegador";
import Footer from "../Layout/footer";
import { api, API_BASE_URL } from "../../api";

function Perfil() {
  const [user, setUser] = useState(null);
  const [socio, setSocio] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      const userResponse = await api.getUser();
      setUser(userResponse.data);

      // Verificar se é sócio
      try {
        const sociosResponse = await api.getSocios();
        const socioUser = sociosResponse.data.find(s => s.user === userResponse.data.id);
        if (socioUser) {
          setSocio(socioUser);
        }
      } catch (err) {
        console.log("Não é sócio");
      }

      setLoading(false);
    } catch (err) {
      console.error("Erro ao carregar perfil:", err);
      navigate("/login");
    }
  };

  const calcularTempoSocio = (dataInscricao) => {
    const inicio = new Date(dataInscricao);
    const agora = new Date();
    const diffTime = Math.abs(agora - inicio);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} dias`;
    } else if (diffDays < 365) {
      const meses = Math.floor(diffDays / 30);
      return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
    } else {
      const anos = Math.floor(diffDays / 365);
      const meses = Math.floor((diffDays % 365) / 30);
      if (meses > 0) {
        return `${anos} ${anos === 1 ? 'ano' : 'anos'} e ${meses} ${meses === 1 ? 'mês' : 'meses'}`;
      }
      return `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
    }
  };

  if (loading) {
    return (
      <>
        <Navegador />
        <div className="auth-page">
          <div className="auth-container">
            <div className="auth-card">
              <p>A carregar...</p>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navegador />
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <h1>Meu Perfil</h1>
            <p>Informações da tua conta</p>

            <div className="perfil-info">
              {user?.profile_pic && (
                <img
                  src={`${API_BASE_URL}${user.profile_pic}`}
                  alt={user.username}
                  className="perfil-avatar"
                />
              )}

              <div className="perfil-dados">
                <div className="perfil-item">
                  <strong>Nome de utilizador:</strong>
                  <p>{user?.username}</p>
                </div>

                <div className="perfil-item">
                  <strong>Email:</strong>
                  <p>{user?.email || "Não definido"}</p>
                </div>

                {socio && (
                  <>
                    <div className="perfil-item socio-badge">
                      <strong>Número de Sócio:</strong>
                      <p>Sócio #{socio.numero_socio}</p>
                    </div>

                    <div className="perfil-item">
                      <strong>Sócio há:</strong>
                      <p>{calcularTempoSocio(socio.data_inscricao)}</p>
                    </div>

                    <div className="perfil-item">
                      <strong>Tipo de Sócio:</strong>
                      <p>{socio.tipo_socio.charAt(0).toUpperCase() + socio.tipo_socio.slice(1)}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Perfil;