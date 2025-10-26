import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar"; //Importando a Navbar
import Footer from "../components/Footer"; //Importando o Footer

const HomeLayout = () => {
  return (
    <div>
      <Navbar /> {/* Navbar fixa */}
      <main>
      <Outlet/>  {/* Renderiza as páginas dentro do layout */}
      </main>
      <Footer />
    </div>
  );
};

export default HomeLayout