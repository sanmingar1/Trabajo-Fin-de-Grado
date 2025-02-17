import React, { useEffect, useRef } from 'react';
import SelectorGrafica from './selector_grafica_grande';

function MetricasDashboard(){
    const contenedorRef = useRef(null); // Referencia al primer contenedor
    const contenedorRef2 = useRef(null); // Referencia al segundo contenedor
    // const contenedorRef3 = useRef(null); // Referencia al tercer contenedor
    

    useEffect(() => {
        fetch('http://localhost:5000/api/prueba')
        .then((response) => {
            if (!response.ok) throw Error('Error en la solicitud');
            return response.json();
        })
        .then((data) => {
            if (contenedorRef.current) {
            contenedorRef.current.innerHTML = '';
            window.Bokeh.embed.embed_item(data, contenedorRef.current);
            }
            if (contenedorRef2.current) {
            contenedorRef2.current.innerHTML = '';
            window.Bokeh.embed.embed_item(data, contenedorRef2.current);
            }
            // if (contenedorRef3.current) {
            //     contenedorRef3.current.innerHTML = '';
            //     window.Bokeh.embed.embed_item(data, contenedorRef3.current);
            //     }
        })
        .catch((error) => console.error('Error al cargar los datos:', error));
    }, []);
    
    

    return (
        <div className='metricas_dashboard'>
           
        <div className='dashboard-container'>
        <div id="contenedor" ref={contenedorRef} className="bokeh-container"></div>
        <div id="contenedor2" ref={contenedorRef2} className="bokeh-container"></div>
        {/* <div id="contenedor3" ref={contenedorRef3} className="bokeh-container"></div> */}
        
        </div>
        {/* <SelectorGrafica/> */}
        
        
        </div>
    )
};

export default MetricasDashboard;