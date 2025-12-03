import React from "react";
import Head from "./components/Layout/head";
import Footer from "./components/Layout/footer";
import Historia from "./components/Pages/historia";
import Navegador from "./components/Layout/navegador";
import Contactos from "./components/Pages/contactos";
import Instalacoes from "./components/Pages/instalacoes";



function App() {
  return (
    <>
      <Head />
      <Navegador />
      <Historia />
      <Instalacoes />
      <Contactos />
      <Footer />
    </>
  );
}

export default App;