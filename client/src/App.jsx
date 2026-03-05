import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import './index.css'
import MainLayout from "../layouts/MainLayout";
// import Modules from "./pages/Modules";
// import Demo from "./pages/Demo";
// import About from "./pages/About";

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Homepage />} />
        {/* <Route path="/modules" element={<Modules />} /> */}
        {/* <Route path="/demo" element={<Demo />} /> */}
        {/* <Route path="/about" element={<About />} /> */}
        
      </Routes>
    </MainLayout>
  );
}
