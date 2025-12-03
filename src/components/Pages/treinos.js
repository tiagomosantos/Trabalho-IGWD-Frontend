import React, { useState, useEffect } from "react";
import Navegador from "../Layout/navegador";
import Footer from "../Layout/footer";
import axios from "axios";

function Treinos() {
  const [treinadores, setTreinadores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTreinador, setSelectedTreinador] = useState(null);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [nivel, setNivel] = useState("iniciante");
  const [objetivo, setObjetivo] = useState("");
  const [disponibilidade, setDisponibilidade] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/api/treinadores/", { withCredentials: true })
      .then(response => setTreinadores(response.data))
      .catch(error => console.log(error));
  }, []);

  const handlePedido = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/pedidos-treino/", {
        nome,
        email,
        telefone,
        nivel,
        treinador: selectedTreinador.id,
        objetivo,
        disponibilidade
      }, { withCredentials: true });

      const mensagem = response.data.message || "Pedido de treino enviado com sucesso!";
      alert(mensagem);

      setShowModal(false);
      setNome("");
      setEmail("");
      setTelefone("");
      setNivel("iniciante");
      setObjetivo("");
      setDisponibilidade("");
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Erro ao enviar pedido";
      alert(errorMsg);
    }
  };

  return (
    <>
      <Navegador />
      <div className="treinos-page">
        <div className="container">
          <h1>Treinos Personalizados</h1>
          <p className="treinos-intro">
            Escolhe um treinador e agenda o teu treino personalizado
          </p>

          <section className="pacotes-section">
            <h2>Nossos Pacotes</h2>
            <div className="pacotes-grid">
              <div className="pacote-card">
                <h3>Básico</h3>
                <p className="preco">25€</p>
                <ul>
                  <li>1 sessão de treino</li>
                  <li>Análise técnica</li>
                  <li>Duração: 60 minutos</li>
                </ul>
              </div>

              <div className="pacote-card destaque">
                <h3>Intermédio</h3>
                <p className="preco">90€</p>
                <ul>
                  <li>4 sessões de treino</li>
                  <li>Análise técnica completa</li>
                  <li>Plano de treino personalizado</li>
                  <li>Duração: 60 minutos cada</li>
                </ul>
              </div>

              <div className="pacote-card">
                <h3>Avançado</h3>
                <p className="preco">200€</p>
                <ul>
                  <li>10 sessões de treino</li>
                  <li>Análise técnica e tática</li>
                  <li>Plano personalizado</li>
                  <li>Acompanhamento contínuo</li>
                  <li>Duração: 60 minutos cada</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="treinadores-section">
            <h2>Nossos Treinadores</h2>
            <div className="treinadores-grid">
              {treinadores.map(treinador => (
                <div key={treinador.id} className="treinador-card">
                  {treinador.foto && (
                    <img
                      src={treinador.foto}
                      alt={treinador.nome}
                      className="treinador-foto"
                    />
                  )}
                  <h3>{treinador.nome}</h3>
                  <p className="especialidade">{treinador.especialidade}</p>
                  <p><strong>Experiência:</strong> {treinador.experiencia}</p>
                  <p><strong>Certificação:</strong> {treinador.certificacao}</p>
                  <p className="descricao">{treinador.descricao}</p>
                  <button
                    className="btn-submit"
                    onClick={() => { setSelectedTreinador(treinador); setShowModal(true); }}
                  >
                    Solicitar Treino
                  </button>
                </div>
              ))}
            </div>
          </section>

          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="pedido-section">
                  <h2>Pedido de Treino com {selectedTreinador?.nome}</h2>
                  <form onSubmit={handlePedido} className="form-pedido">
                    <div className="form-group">
                      <label>Nome:</label>
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
                      <label>Nível:</label>
                      <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
                        <option value="iniciante">Iniciante</option>
                        <option value="intermedio">Intermédio</option>
                        <option value="avancado">Avançado</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Objetivo do Treino:</label>
                      <textarea
                        value={objetivo}
                        onChange={(e) => setObjetivo(e.target.value)}
                        required
                        rows="3"
                      />
                    </div>

                    <div className="form-group">
                      <label>Disponibilidade:</label>
                      <textarea
                        value={disponibilidade}
                        onChange={(e) => setDisponibilidade(e.target.value)}
                        required
                        rows="2"
                        placeholder="Ex: Segundas e Quartas, 18h-20h"
                      />
                    </div>

                    <div className="modal-buttons">
                      <button type="submit" className="btn-submit">Enviar Pedido</button>
                      <button
                        type="button"
                        className="btn-submit btn-cancel"
                        onClick={() => setShowModal(false)}
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Treinos;