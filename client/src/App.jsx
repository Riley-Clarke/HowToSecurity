import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import './index.css'
import MainLayout from "../layouts/MainLayout";
import LearningModules from "./pages/LearningModules";
import ModuleRenderer from "./pages/ModuleRenderer";
import SandboxHome from "./pages/sandbox/SandboxHome";
import SandboxRenderer from "./pages/sandbox/SandboxRenderer";
import Glossary from "./pages/Glossary";

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/learning-modules" element={<LearningModules />} />
        <Route path="/modules/:moduleId" element={<ModuleRenderer />} />
        <Route path="/sandbox" element={<SandboxHome />} />
        <Route path="/sandbox/:sandboxId" element={<SandboxRenderer />} />
        <Route path="/glossary" element={<Glossary />} />
        
      </Routes>
    </MainLayout>
  );
}
