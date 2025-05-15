import React, { useState } from 'react';
import Eda from './eda.js';
import PrediccionStock from './prediccion_stock.js';
import Clustering from './clustering.js';
import './css/App.css';

function App() {
  const [componenteActual, setComponenteActual] = useState('Eda');

  const renderizarComponente = () => {
    switch (componenteActual) {
      case 'Eda':
        return <Eda />;
      case 'Stock':
        return <PrediccionStock />;
      case 'Clustering':
        return <Clustering />;
      default:
        return <Eda />;
    }
  };

  return (
    <div className="contenedor_global">
      <nav>
        <button
          className={componenteActual === 'Eda' ? 'activo' : ''}
          onClick={() => setComponenteActual('Eda')}
        >
          Eda
        </button>
        <button
          className={componenteActual === 'Stock' ? 'activo' : ''}
          onClick={() => setComponenteActual('Stock')}
        >
          Stock
        </button>
        <button
          className={componenteActual === 'Clustering' ? 'activo' : ''}
          onClick={() => setComponenteActual('Clustering')}
        >
          Clustering
        </button>
      </nav>

      <div className="contenido">
        {renderizarComponente()}
      </div>
    </div>
  );
}

export default App;
