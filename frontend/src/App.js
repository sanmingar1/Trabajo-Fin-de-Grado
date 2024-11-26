import './App.css';
import React, { useEffect, useRef } from 'react';
import VentasPorFecha from './ventas_fecha';
import MetricasDashboard from './metricas_dashboard';
function App() {


  return (
    <div className="App">
      <VentasPorFecha />
      <MetricasDashboard/>
    </div>
  );
}

export default App;
