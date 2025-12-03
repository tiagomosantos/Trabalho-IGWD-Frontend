import React, { useState, useEffect } from "react";
import Navegador from "../Layout/navegador";
import Footer from "../Layout/footer";
import { api } from "../../api";

function Torneios() {
  const [torneios, setTorneios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTorneio, setSelectedTorneio] = useState(null);
  const [nomeEquipa, setNomeEquipa] = useState("");
  const [jogador1, setJogador1] = useState("");
  const [jogador2, setJogador2] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  useEffect(() => {
    const carregarTorneios = async () => {
      try {
        const response = await api.getTorneios();
        setTorneios(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    carregarTorneios();
  }, []);

  const handleInscricao = async (e) => {
    e.preventDefault();
    try {
      const response = await api.createInscricao({
        torneio: selectedTorneio.id,
        nome_equipa: nomeEquipa,
        jogador1,
        jogador2,
        email,
        telefone
      });

      const mensagem = response.data.message || "Inscrição realizada com sucesso!";
      alert(mensagem);

      setShowModal(false);
      setNomeEquipa("");
      setJogador1("");
      setJogador2("");
      setEmail("");
      setTelefone("");
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Erro na inscrição";
      alert(errorMsg);
    }
  };

  return (
    <>
      <Navegador />
      <div className="torneios-page">
        <div className="container">
          <h1>Torneios</h1>
          <p className="torneios-intro">
            Participa nos nossos torneios e desafia-te contra os melhores jogadores!
          </p>

          <div className="torneios-lista">
            {torneios.map(torneio => (
              <div key={torneio.id} className="torneio-card">
                <h3>{torneio.nome}</h3>
                <div className="torneio-info">
                  <p><strong>Data:</strong> {torneio.data}</p>
                  <p><strong>Categoria:</strong> {torneio.categoria}</p>
                  <p><strong>Prémio:</strong> {torneio.premio}€</p>
                  <p>
                    <strong>Inscrições:</strong>{" "}
                    <span className={torneio.inscricoes === "abertas" ? "abertas" : "fechadas"}>
                      {torneio.inscricoes}
                    </span>
                  </p>
                </div>
                {torneio.descricao && (
                  <p className="torneio-descricao">{torneio.descricao}</p>
                )}
                {torneio.inscricoes === "abertas" && (
                  <button
                    className="btn-inscrever"
                    onClick={() => { setSelectedTorneio(torneio); setShowModal(true); }}
                  >
                    Inscrever-me
                  </button>
                )}
              </div>
            ))}
          </div>

          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="inscricao-section">
                  <h2>Inscrição em {selectedTorneio?.nome}</h2>
                  <form onSubmit={handleInscricao} className="form-inscricao">
                    <div className="form-group">
                      <label>Nome da Equipa:</label>
                      <input
                        type="text"
                        value={nomeEquipa}
                        onChange={(e) => setNomeEquipa(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Jogador 1:</label>
                      <input
                        type="text"
                        value={jogador1}
                        onChange={(e) => setJogador1(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Jogador 2:</label>
                      <input
                        type="text"
                        value={jogador2}
                        onChange={(e) => setJogador2(e.target.value)}
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

                    <div className="modal-buttons">
                      <button type="submit" className="btn-submit">Confirmar Inscrição</button>
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

export default Torneios;