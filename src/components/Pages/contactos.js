import React from "react";

function Contactos() {
  return (
    <section className="contactos" id="contactos">
      <div className="container">
        <h2>Contactos</h2>

        <div className="contactos-grid">
          <div className="contacto-item">
            <h3>Morada</h3>
            <p>Avenida das Forças Armadas</p>
            <p>1649-026 Lisboa</p>
          </div>

          <div className="contacto-item">
            <h3>Telefone</h3>
            <p>+351 217 903 000</p>
          </div>

          <div className="contacto-item">
            <h3>Email</h3>
            <p>info@padelclubportugal.pt</p>
          </div>

          <div className="contacto-item">
            <h3>Horário</h3>
            <p>Segunda a Domingo: 08:00 - 23:00</p>
          </div>

          <div className="contacto-item">
            <h3>Redes Sociais</h3>
            <p>Facebook: @padelclubportugal</p>
            <p>Instagram: @padelclubportugal</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contactos;