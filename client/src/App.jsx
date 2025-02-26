import { lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./screens/Home";

// lazy imports for code splitting
const About = lazy(() => import("./screens/About"));
const Login = lazy(() => import("./screens/Login"));
const Register = lazy(() => import("./screens/Register"));

const App = () => {
  return (
    <Router>
      <Header />
        <Routes>
          <Route path="/" element={<HomePage/>} exact />
          <Route path="/about" element={<About/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      <Footer />
    </Router>
  );
};

export default App;