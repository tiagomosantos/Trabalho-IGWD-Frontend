import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navegador from "../Layout/navegador";
import Footer from "../Layout/footer";
import axios from "axios";

function MinhasReservas() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    carregarReservas();
  }, []);

  const carregarReservas = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/reservas/", {
        withCredentials: true
      });
      setReservas(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao carregar reservas:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/login");
      }
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navegador />
        <div className="reservas-page">
          <div className="container">
            <h1>A carregar...</h1>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navegador />
      <div className="reservas-page">
        <div className="container">
          <h1>Minhas Reservas</h1>
          <p className="reservas-intro">
            Consulta todas as tuas reservas de campos
          </p>

          {reservas.length === 0 ? (
            <div className="info-reservas">
              <p>Ainda não tens reservas. Faz a tua primeira reserva!</p>
            </div>
          ) : (
            <div className="torneios-lista">
              {reservas.map((reserva) => (
                <div key={reserva.id} className="torneio-card">
                  <h3>Campo {reserva.campo}</h3>
                  <div className="torneio-info">
                    <p><strong>Data:</strong> {reserva.data}</p>
                    <p><strong>Hora:</strong> {reserva.hora}</p>
                    <p><strong>Duração:</strong> {reserva.duracao} minutos</p>
                    <p><strong>Estado:</strong> <span className="abertas">Confirmada</span></p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MinhasReservas;