import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Splash from './pages/Splash';
import Login from './pages/Login';
import Resident from './pages/Resident';
import Responder from './pages/Responder';
import CommandCenter from './pages/CommandCenter';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/resident" element={<Resident />} />
          <Route path="/responder" element={<Responder />} />
          <Route path="/command-center" element={<CommandCenter />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
