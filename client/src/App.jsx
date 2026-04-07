import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import './index.css'
import MainLayout from "../layouts/MainLayout";
import LearningModules from "./pages/LearningModules";
import ModuleRenderer from "./pages/ModuleRenderer";
import SandboxHome from "./pages/sandbox/SandboxHome";
import SandboxRenderer from "./pages/sandbox/SandboxRenderer";
// import Demo from "./pages/Demo";
// import About from "./pages/About";

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/learning-modules" element={<LearningModules />} />
        <Route path="/modules/:moduleId" element={<ModuleRenderer />} />
        <Route path="/sandbox" element={<SandboxHome />} />
        <Route path="/sandbox/:sandboxId" element={<SandboxRenderer />} />
        {/* <Route path="/demo" element={<Demo />} /> */}
        {/* <Route path="/about" element={<About />} /> */}
        
      </Routes>
    </MainLayout>
  );
}
