import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navegador from "../Layout/navegador";
import Footer from "../Layout/footer";
import { api } from "../../api";

function Reservas() {
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [duracao, setDuracao] = useState("");
  const [campo, setCampo] = useState("");
  const [reservasExistentes, setReservasExistentes] = useState([]);
  const [horaAtual, setHoraAtual] = useState("");
  const navigate = useNavigate();

  // Horários disponíveis (8h às 23h, intervalos de 30min)
  const horariosDisponiveis = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
    "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"
  ];

  useEffect(() => {
    // Atualizar hora atual
    const agora = new Date();
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    setHoraAtual(`${horas}:${minutos}`);
  }, []);

  useEffect(() => {
    if (data) {
      carregarReservas();
      // Reset seleções quando muda o dia
      setHora("");
      setDuracao("");
      setCampo("");
    }
  }, [data]);

  useEffect(() => {
    // Reset campo quando muda hora ou duração
    if (hora || duracao) {
      setCampo("");
    }
  }, [hora, duracao]);

  const carregarReservas = async () => {
    try {
      const response = await api.getReservas();
      const reservasFiltradas = response.data.filter(r => r.data === data);
      setReservasExistentes(reservasFiltradas);
    } catch (err) {
      console.error("Erro ao carregar reservas:", err);
      setReservasExistentes([]);
    }
  };

  const isHorarioPassado = (horario) => {
    if (!data) return false;

    const hoje = new Date().toISOString().split('T')[0];
    if (data !== hoje) return false;

    // Se é hoje, verificar se a hora já passou
    return horario <= horaAtual;
  };

  const isHorarioOcupado = (horario, campoNum) => {
    return reservasExistentes.some(reserva => {
      // Verificar se é do mesmo campo
      if (campoNum && reserva.campo !== parseInt(campoNum)) {
        return false;
      }

      const horaReserva = reserva.hora.substring(0, 5);
      const duracaoMin = parseInt(reserva.duracao);

      const [h, m] = horaReserva.split(':').map(Number);
      const inicioMin = h * 60 + m;
      const fimMin = inicioMin + duracaoMin;

      const [hCheck, mCheck] = horario.split(':').map(Number);
      const checkMin = hCheck * 60 + mCheck;

      return checkMin >= inicioMin && checkMin < fimMin;
    });
  };

  const isHorarioValido = (horario) => {
    if (isHorarioPassado(horario)) return false;

    // Verificar se pelo menos 1 campo está disponível
    for (let i = 1; i <= 6; i++) {
      if (!isHorarioOcupado(horario, i)) {
        return true;
      }
    }
    return false;
  };

  const isCampoDisponivel = (campoNum) => {
    if (!hora || !duracao) return true;

    const duracaoMinutos = parseInt(duracao);
    const [h, m] = hora.split(':').map(Number);
    const horaInicioMin = h * 60 + m;
    const horaFimMin = horaInicioMin + duracaoMinutos;

    // Verificar se alguma reserva existente colide
    return !reservasExistentes.some(reserva => {
      if (reserva.campo !== parseInt(campoNum)) return false;

      const horaReserva = reserva.hora.substring(0, 5);
      const [hr, mr] = horaReserva.split(':').map(Number);
      const reservaInicioMin = hr * 60 + mr;
      const reservaFimMin = reservaInicioMin + parseInt(reserva.duracao);

      // Verificar sobreposição
      return (horaInicioMin < reservaFimMin && horaFimMin > reservaInicioMin);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data || !hora || !duracao || !campo) {
      alert("Por favor preenche todos os campos!");
      return;
    }

    try {
      const response = await api.createReserva({
        data,
        hora,
        campo: parseInt(campo),
        duracao: parseInt(duracao)
      });

      alert(response.data.message || "Reserva criada com sucesso!");

      // Reset
      setData("");
      setHora("");
      setDuracao("");
      setCampo("");
      setReservasExistentes([]);
    } catch (error) {
      if (error.response?.status === 401) {
        alert("É necessário fazer login para reservar!");
        navigate("/login");
      } else {
        const errorMsg = error.response?.data?.error || "Erro ao criar reserva";
        alert(errorMsg);
      }
    }
  };

  const getDataMinima = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <>
      <Navegador />
      <div className="reservas-page">
        <div className="container">
          <h1>Reservas de Campos</h1>
          <p className="reservas-intro">
            Reserva o teu campo de padel de forma rápida e fácil!
          </p>

          <form onSubmit={handleSubmit} className="form-reserva">
            {/* PASSO 1: Escolher Data */}
            <div className="form-group">
              <label>
                <span className="step-number">1</span> Escolhe o Dia:
              </label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                min={getDataMinima()}
                required
              />
            </div>

            {/* PASSO 2: Escolher Hora (só aparece depois de escolher data) */}
            {data && (
              <div className="form-group">
                <label>
                  <span className="step-number">2</span> Escolhe a Hora:
                </label>
                <div className="horarios-grid">
                  {horariosDisponiveis.map((horario) => {
                    const valido = isHorarioValido(horario);
                    const passado = isHorarioPassado(horario);

                    return (
                      <button
                        key={horario}
                        type="button"
                        className={`horario-btn ${hora === horario ? 'selected' : ''} ${!valido ? 'ocupado' : ''}`}
                        onClick={() => valido && setHora(horario)}
                        disabled={!valido}
                        title={passado ? "Horário já passou" : (!valido ? "Todos os campos ocupados" : "Disponível")}
                      >
                        {horario}
                      </button>
                    );
                  })}
                </div>
                {hora && (
                  <p className="horario-selecionado">
                    ✓ Horário selecionado: <strong>{hora}</strong>
                  </p>
                )}
              </div>
            )}

            {/* PASSO 3: Escolher Duração (só aparece depois de escolher hora) */}
            {hora && (
              <div className="form-group">
                <label>
                  <span className="step-number">3</span> Escolhe a Duração:
                </label>
                <div className="duracao-grid">
                  <button
                    type="button"
                    className={`duracao-btn ${duracao === '60' ? 'selected' : ''}`}
                    onClick={() => setDuracao('60')}
                  >
                    <span className="duracao-tempo">1 hora</span>
                    <span className="duracao-descricao">60 minutos</span>
                  </button>
                  <button
                    type="button"
                    className={`duracao-btn ${duracao === '90' ? 'selected' : ''}`}
                    onClick={() => setDuracao('90')}
                  >
                    <span className="duracao-tempo">1h30</span>
                    <span className="duracao-descricao">90 minutos</span>
                  </button>
                  <button
                    type="button"
                    className={`duracao-btn ${duracao === '120' ? 'selected' : ''}`}
                    onClick={() => setDuracao('120')}
                  >
                    <span className="duracao-tempo">2 horas</span>
                    <span className="duracao-descricao">120 minutos</span>
                  </button>
                </div>
              </div>
            )}

            {/* PASSO 4: Escolher Campo (só aparece depois de escolher duração) */}
            {duracao && (
              <div className="form-group">
                <label>
                  <span className="step-number">4</span> Escolhe o Campo:
                </label>
                <div className="campos-grid">
                  {[1, 2, 3, 4, 5, 6].map((num) => {
                    const disponivel = isCampoDisponivel(num);
                    return (
                      <button
                        key={num}
                        type="button"
                        className={`campo-btn ${campo === String(num) ? 'selected' : ''} ${!disponivel ? 'ocupado' : ''}`}
                        onClick={() => disponivel && setCampo(String(num))}
                        disabled={!disponivel}
                      >
                        <span className="campo-numero">Campo {num}</span>
                        <span className="campo-status">
                          {disponivel ? '✓ Disponível' : '✗ Ocupado'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Botão de Submeter (só aparece quando tudo está preenchido) */}
            {campo && (
              <div className="resumo-reserva">
                <h3>Resumo da Reserva:</h3>
                <p><strong>Data:</strong> {new Date(data + 'T00:00:00').toLocaleDateString('pt-PT')}</p>
                <p><strong>Hora:</strong> {hora}</p>
                <p><strong>Duração:</strong> {duracao === '60' ? '1 hora' : duracao === '90' ? '1h30' : '2 horas'}</p>
                <p><strong>Campo:</strong> Campo {campo}</p>
                <button type="submit" className="btn-submit">Confirmar Reserva</button>
              </div>
            )}
          </form>

          <div className="info-reservas">
            <h3>Informações Importantes</h3>
            <ul>
              <li>Reservas podem ser feitas a partir de hoje</li>
              <li>Horários disponíveis: 08:00 - 23:00</li>
              <li>Sócios têm prioridade nas reservas</li>
              <li>Cancelamentos devem ser feitos com 24h de antecedência</li>
              <li>Preço: 15€/hora para sócios | 20€/hora para não sócios</li>
            </ul>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Reservas;