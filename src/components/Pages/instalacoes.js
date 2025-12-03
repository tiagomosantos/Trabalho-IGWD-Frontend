import React from "react";

function Instalacoes() {
  return (
    <section className="instalacoes" id="instalacoes">
      <div className="container">
        <h2>As Nossas Instalações</h2>

        <div className="instalacoes-grid">
          <div className="instalacao-card">
            <h3>6 Campos de Padel</h3>
            <p>Campos profissionais com iluminação LED e superfície de última geração</p>
          </div>

          <div className="instalacao-card">
            <h3>Balneários</h3>
            <p>Balneários equipados com cacifos, duches e climatização</p>
          </div>

          <div className="instalacao-card">
            <h3>Bar / Restaurante</h3>
            <p>Espaço para convívio com snacks, refeições ligeiras e bebidas</p>
          </div>

          <div className="instalacao-card">
            <h3>Loja</h3>
            <p>Raquetes, bolas, roupa e acessórios das melhores marcas</p>
          </div>

          <div className="instalacao-card">
            <h3>Esplanada</h3>
            <p>Para beber um cafézinho, uma mini e meter a conversa em dia ao ar livre</p>
          </div>

          <div className="instalacao-card">
            <h3>Estacionamento</h3>
            <p>Parque de estacionamento gratuito para sócios e visitantes</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Instalacoes;