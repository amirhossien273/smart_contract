import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CreateAgreement from './pages/CreateAgreement';
import TenantSign from './pages/TenantSign';
import LandlordSign from './pages/LandlordSign';
import ViewAgreement from './pages/ViewAgreement';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/create" element={<CreateAgreement />} />
        <Route path="/tenant-sign" element={<TenantSign  role="tenant" />} />
        <Route path="/landlord-sign" element={<LandlordSign role="landlord"  />} />
        <Route path="/view" element={<ViewAgreement />} />
      </Routes>
   </Router>
  );
}

export default App;
