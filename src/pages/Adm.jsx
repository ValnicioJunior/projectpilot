import LayoutAdmin from "../components/LayoutAdmin";
import PageWrapper from "../components/PageWrapper";
import Dashboard from "../components/Dashboard";
import "../styles/Adm.css";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

const Adm = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const justLoggedIn = localStorage.getItem("justLoggedIn");
      if (justLoggedIn === "true") {
        toast.success("Seja bem vindo a página de administrador!");
        localStorage.removeItem("justLoggedIn");
      }
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <LayoutAdmin>
      <PageWrapper>
        <div className="header-upload">
          <h1>Dashboard</h1>
        </div>
        <Dashboard />
      </PageWrapper>
      <ToastContainer />
    </LayoutAdmin>
  );
};

export default Adm;
