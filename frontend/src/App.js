import './css/App.css'
import './css/ProductosMasVendidos.css'
import './css/GraficaGrande.css'
import './css/EstacionalidadVentas.css'
import './css/ventas_fecha.css'
import './css/numero_devoluciones.css'
import './css/Clustering.css'
import React, { useEffect, useRef,useState } from 'react';
import VentasPorFecha from './ventas_fecha';
import MetricasDashboard from './metricas_dashboard';
import SelectorGrafica from './grafica_grande';
import NumeroDevoluciones from './numero_devoluciones';
import ProductosMasVendidos from './productos_mas_vendidos';
import EstacionalidadVentas from './estacionalidadVentas';
import Clustering from './clustering';

function App() {

const [fecha, setFecha] = useState("2023-06-30"); // Fecha predeterminada

  return (
    <div className='contenedor_global'>
      <div className='columna_izquierda'>
        <div className="columna_izquierda_superior">
          <div className='selector_fecha'>
          <form>
              <input
                type="date"
                id="fecha"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                min="2020-07-01" // Fecha mínima
                max="2023-06-30" // Fecha máxima
                required
              />
              </form>
            </div>
          <VentasPorFecha fecha_seleccionada={fecha}/>
          
          <NumeroDevoluciones fecha_seleccionada={fecha}/>
          <ProductosMasVendidos fecha_seleccionada={fecha} />
        </div>
        <div className='columna_izquierda_inferior'>
          <SelectorGrafica/>
        </div>
    
     </div>
      <div className='columna_derecha'>
        <Clustering/>
        <EstacionalidadVentas/>
      </div>
    </div>
  );
}

export default App;
