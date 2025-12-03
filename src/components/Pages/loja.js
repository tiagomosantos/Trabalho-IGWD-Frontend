import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navegador from "../Layout/navegador";
import Footer from "../Layout/footer";
import { api } from "../../api";

function Loja() {
  const [artigos, setArtigos] = useState([]);
  const [novaAvaliacao, setNovaAvaliacao] = useState({});
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    carregarArtigos();
    verificarUser();
  }, []);

  const verificarUser = async () => {
    try {
      const response = await api.getUser();
      setUser(response.data);
    } catch (err) {
      setUser(null);
    }
  };

  const carregarArtigos = async () => {
    try {
      const response = await api.getArtigos();
      setArtigos(response.data);
    } catch (err) {
      console.error("Erro ao carregar artigos:", err);
      setError("Erro ao carregar artigos");
    }
  };

  const handleAvaliacaoChange = (artigoId, field, value) => {
    setNovaAvaliacao({
      ...novaAvaliacao,
      [artigoId]: {
        ...novaAvaliacao[artigoId],
        [field]: value,
      },
    });
  };

  const handleAdicionarAvaliacao = async (artigoId) => {
    if (!user) {
      alert("É necessário fazer login para avaliar!");
      navigate("/login");
      return;
    }

    const avaliacao = novaAvaliacao[artigoId];
    if (!avaliacao?.estrelas || !avaliacao?.comentario) {
      alert("Por favor preenche a avaliação e o comentário!");
      return;
    }

    try {
      const response = await api.createAvaliacao({
        artigo: artigoId,
        estrelas: avaliacao.estrelas,
        comentario: avaliacao.comentario,
      });

      // Limpar formulário
      setNovaAvaliacao({
        ...novaAvaliacao,
        [artigoId]: { estrelas: 5, comentario: "" },
      });

      // Recarregar artigos para mostrar nova avaliação
      await carregarArtigos();

      alert("Avaliação adicionada com sucesso!");
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Erro ao adicionar avaliação";
      alert(errorMsg);
    }
  };

  const renderEstrelas = (avaliacao) => {
    const estrelas = [];
    for (let i = 1; i <= 5; i++) {
      estrelas.push(
        <span
          key={i}
          className={i <= avaliacao ? "estrela-cheia" : "estrela-vazia"}
        >
          ★
        </span>
      );
    }
    return estrelas;
  };

  return (
    <>
      <Navegador />
      <div className="loja-page">
        <div className="container">
          <h1>Loja</h1>

          <p className="loja-intro">
            Descobre os melhores produtos para o teu jogo de padel.
          </p>

          {error && <div className="error-message">{error}</div>}

          <div className="loja-aviso">
            <p>
              📍 <strong>Nota:</strong> Todos os artigos estão disponíveis para
              compra no clube. Visita-nos!
            </p>
          </div>

          <div className="artigos-grid">
            {artigos.map((artigo) => (
              <div key={artigo.id} className="artigo-card">
                <img src={artigo.imagem} alt={artigo.nome} />
                <h3>{artigo.nome}</h3>
                <p className="preco">{parseFloat(artigo.preco).toFixed(2)}€</p>
                <div className="avaliacao">
                  {renderEstrelas(artigo.avaliacao_media)}
                  <span className="avaliacao-numero">
                    ({artigo.avaliacao_media}) - {artigo.numero_avaliacoes}{" "}
                    avaliações
                  </span>
                </div>

                <div className="comentarios-section">
                  <h4>Avaliações</h4>
                  {artigo.avaliacoes?.length > 0 ? (
                    <div className="comentarios-lista">
                      {artigo.avaliacoes.map((av) => (
                        <div key={av.id} className="comentario">
                          <div className="comentario-header">
                            {av.user_profile_pic && (
                              <img
                                src={`http://localhost:8000${av.user_profile_pic}`}
                                alt={av.username}
                                className="comentario-avatar"
                              />
                            )}
                            <strong>{av.username}</strong>
                            <div className="avaliacao">
                              {renderEstrelas(av.estrelas)}
                            </div>
                          </div>
                          <p>{av.comentario}</p>
                          <span className="comentario-data">
                            {new Date(av.data).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="sem-comentarios">Ainda não há avaliações.</p>
                  )}

                  <div className="adicionar-comentario">
                    <div className="form-group">
                      <label>Estrelas:</label>
                      <select
                        value={novaAvaliacao[artigo.id]?.estrelas || 5}
                        onChange={(e) =>
                          handleAvaliacaoChange(
                            artigo.id,
                            "estrelas",
                            parseInt(e.target.value)
                          )
                        }
                      >
                        <option value="5">5 ★★★★★</option>
                        <option value="4">4 ★★★★</option>
                        <option value="3">3 ★★★</option>
                        <option value="2">2 ★★</option>
                        <option value="1">1 ★</option>
                      </select>
                    </div>
                    <textarea
                      placeholder="Escreve o teu comentário..."
                      value={novaAvaliacao[artigo.id]?.comentario || ""}
                      onChange={(e) =>
                        handleAvaliacaoChange(
                          artigo.id,
                          "comentario",
                          e.target.value
                        )
                      }
                    />
                    <button onClick={() => handleAdicionarAvaliacao(artigo.id)}>
                      Adicionar Avaliação
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Loja;
