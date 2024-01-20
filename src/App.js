import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/js/Home';
import Landing from './components/js/Landing';
import AddInvoice from './components/js/AddInvoice';
import ViewInvoice from './components/js/ViewInvoice';
import EditInvoice from './components/js/EditInvoice';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/home" replace />}
        />
        <Route path="/home/*" element={
          <Home>
            <Routes>         
              <Route path="/" element={<Landing />} />
              <Route path="/add" element={<AddInvoice />} />
              <Route path="/view/:id" element={<ViewInvoice />} />
              <Route path="/view/:id/edit" element={<EditInvoice />} />
            </Routes>
          </Home>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
