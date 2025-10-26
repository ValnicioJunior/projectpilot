import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/ProtectedRoute"; // Importação de sistema de rotas protegidas
import LayoutAdmin from "./components/LayoutAdmin";
import "./App.css";

//           ----- Páginas públicas ------

import {
  LandingPage,
  ErrorPage,
  HomeLayout,
  Login,
  DashboardPage,
  Contact,
  Certificates,
  Registro,
  Forum,
  Mentoria,
  Course,
  PerguntaForum
} from "./pages/index.js";

//           ----- Páginas Administrativas ------
import Alunos from "./pages/Alunos";
import Mentores from "./pages/Mentores";
import Access from "./pages/Access";
import CreateCourse from "./pages/CreateCourse.jsx";
import CourseDetail from "./pages/CourseDetail.jsx";
import ModuleMaterials from "./pages/ModuleMaterials.jsx";
import WatchCourse from "./pages/WatchCourse.jsx";
import Adm from "./pages/Adm";


function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      errorElement: <ErrorPage />,
      children: [

        { index: true, element: <Login /> },
        { path: "/signup", element: <Registro /> },
      ],
    },
    {
      path: "/",
      element: <HomeLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "dashboard",
          element: (
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "contato",
          element: (
            <ProtectedRoute>
              <Contact />
            </ProtectedRoute>
          ),
        },
        {
          path: "home",
          element: (
            <ProtectedRoute>
              <LandingPage />
            </ProtectedRoute>
          ),
        },
        {
          path: "curso/:courseId",
          element: (
            <ProtectedRoute>
              {" "}
              <WatchCourse />{" "}
            </ProtectedRoute>
          ),
        },
        {
          path: "forum",
          element: (
            <ProtectedRoute>
              <Forum />
            </ProtectedRoute>
          ),
        },
        {
          path: "forum/:id",
          element: (
            <ProtectedRoute>
              <PerguntaForum />
            </ProtectedRoute>
          )
        },
        {
          path: "mentoria",
          element: (
            <ProtectedRoute>
              <Mentoria />
            </ProtectedRoute>
          ),
        },
        {
          path: "certificados",
          element: (
            <ProtectedRoute>
              <Certificates />
            </ProtectedRoute>
          ),
        },    
      ],
    },
    {
      path: "/adm",
      children: [
        {
          index: true,
          element: (
            <ProtectedRoute>
              <Adm />
            </ProtectedRoute>
          ),
        },
        {
          path: "alunos",
          element: (
            <ProtectedRoute>
              <Alunos />
            </ProtectedRoute>
          ),
        },
        {
          path: "mentores",
          element: (
            <ProtectedRoute>
              <Mentores />
            </ProtectedRoute>
          ),
        },
        {
          path: "access",
          element: (
            <ProtectedRoute>
              <Access />
            </ProtectedRoute>
          ),
        },
        {
          path: "cursos",
          element: (
            <ProtectedRoute>
              <Course />
            </ProtectedRoute>
          ),
        },
        {
          path: "criar-curso",
          element: (
            <ProtectedRoute>
              <CreateCourse />
            </ProtectedRoute>
          ),
        },
        {
          path: "cursos/:courseId",
          element: (
            <ProtectedRoute>
              <CourseDetail />
            </ProtectedRoute>
          ),
        },
        {
          path: "cursos/:courseId/module/:moduleId/materials",
          element: (
            <ProtectedRoute>
              <ModuleMaterials />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
