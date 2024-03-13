import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/js/Home';
import Landing from './components/js/Landing';
import AddInvoice from './components/js/AddInvoice';
import ViewInvoice from './components/js/ViewInvoice';
import EditInvoice from './components/js/EditInvoice';
import Login from './components/js/Login';
import { useState } from 'react';
import Dashboard from './components/js/Dashboard';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/home" replace /> : <Login setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route path="/home/*" element={
     
            <Routes>
            <Route path="/" element={<Dashboard />} />
              <Route path="/dash" element={<Landing />} />
              <Route path="/add" element={<AddInvoice />} />
              <Route path="/view/:id" element={<ViewInvoice />} />
              <Route path="/view/:id/edit" element={<EditInvoice />} />
            </Routes>
          
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
