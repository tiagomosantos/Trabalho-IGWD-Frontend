import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navegador from "../Layout/navegador";
import Footer from "../Layout/footer";
import { api } from "../../api";

function FormSocio() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [morada, setMorada] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [tipoSocio, setTipoSocio] = useState("individual");
  const [jaSocio, setJaSocio] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verificarSocio();
  }, []);

  const verificarSocio = async () => {
    try {
      const response = await api.getSocios();

      // Verificar se o user atual já é sócio
      const userResponse = await api.getUser();

      const socioExistente = response.data.find(
        (s) => s.user === userResponse.data.id
      );
      if (socioExistente) {
        setJaSocio(true);
      }
    } catch (error) {
      console.log("User não autenticado ou erro ao verificar");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (jaSocio) {
      alert("Você já é sócio!");
      return;
    }

    try {
      const response = await api.createSocio({
        nome_completo: nome,
        email,
        telefone,
        morada,
        data_nascimento: dataNascimento,
        tipo_socio: tipoSocio,
      });

      const mensagem = response.data.message || "Sócio criado com sucesso!";
      alert(mensagem);

      setNome("");
      setEmail("");
      setTelefone("");
      setMorada("");
      setDataNascimento("");
      setTipoSocio("individual");
      setJaSocio(true);
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Erro ao criar sócio";
      alert(errorMsg);
    }
  };

  if (loading) {
    return (
      <>
        <Navegador />
        <div className="form-socio-page">
          <div className="container">
            <p>A carregar...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (jaSocio) {
    return (
      <>
        <Navegador />
        <div className="form-socio-page">
          <div className="container">
            <h1>Tornar-me Sócio</h1>
            <div className="form-socio">
              <div className="success-message">
                <p>✅ Você já é sócio do Padel Club Portugal!</p>
                <p>Obrigado por fazer parte da nossa comunidade.</p>
              </div>
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
      <div className="form-socio-page">
        <div className="container">
          <h1>Tornar-me Sócio</h1>
          <p className="form-intro">
            Junta-te à nossa comunidade e desfruta de todos os benefícios
            exclusivos do Padel Club Portugal!
          </p>

          <form onSubmit={handleSubmit} className="form-socio">
            <div className="form-group">
              <label>Nome Completo:</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Telefone:</label>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Morada:</label>
              <input
                type="text"
                value={morada}
                onChange={(e) => setMorada(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Data de Nascimento:</label>
              <input
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Tipo de Sócio:</label>
              <select
                value={tipoSocio}
                onChange={(e) => setTipoSocio(e.target.value)}
              >
                <option value="individual">Individual (50€/ano)</option>
                <option value="familiar">Familiar (80€/ano)</option>
                <option value="estudante">Estudante (35€/ano)</option>
              </select>
            </div>

            <button type="submit" className="btn-submit">
              Submeter
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default FormSocio;
