import './css/App.css'
import './css/ProductosMasVendidos.css'
import './css/GraficaGrande.css'
import './css/EstacionalidadVentas.css'
import React, { useEffect, useRef } from 'react';
import VentasPorFecha from './ventas_fecha';
import MetricasDashboard from './metricas_dashboard';
import SelectorGrafica from './selector_grafica_grande';
import NumeroDevoluciones from './numero_devoluciones';
import ProductosMasVendidos from './productos_mas_vendidos';
import EstacionalidadVentas from './estacionalidadVentas';

function App() {


  return (
    <div className='contenedor'>
      <div className='contenedor_interno'>
        <div className="App">
          <VentasPorFecha />
          <MetricasDashboard/>
          
        </div>
        <div className='SelectorGrafica'>
          <SelectorGrafica/>
        </div>
    
     </div>
      <div className='estadisticas'>
        <div className='numeroDevoluciones'>
        <NumeroDevoluciones/>
        </div>
        <div className='productoMasVendido'>
        <ProductosMasVendidos/>
        </div>
        <div className='estacionalidad-Ventas'>
        <EstacionalidadVentas/>
        </div>
      </div>
    </div>
  );
}

export default App;
