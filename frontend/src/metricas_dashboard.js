import React, { useEffect, useRef } from 'react';

function MetricasDashboard(){
    const contenedorRef = useRef(null); // Referencia al primer contenedor
    const contenedorRef2 = useRef(null); // Referencia al segundo contenedor
    const contenedorRef3 = useRef(null); // Referencia al tercer contenedor
    const contenedorRef4 = useRef(null); // Referencia al cuarto contenedor

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
            if (contenedorRef3.current) {
                contenedorRef3.current.innerHTML = '';
                window.Bokeh.embed.embed_item(data, contenedorRef3.current);
                }
        })
        .catch((error) => console.error('Error al cargar los datos:', error));
    }, []);
    useEffect(() => {
        fetch('http://localhost:5000/api/prueba_grafica_grande')
        .then((response) => {
            if (!response.ok) throw Error('Error en la solicitud');
            return response.json();
        })
        .then((data) => {
            if (contenedorRef4.current) {
            contenedorRef4.current.innerHTML = '';
            window.Bokeh.embed.embed_item(data, contenedorRef4.current);
            }
        })
        .catch((error) => console.error('Error al cargar los datos:', error));
    }, []);
    return (
        <div>
        <div className='dashboard-container'>
        <div id="contenedor" ref={contenedorRef} className="bokeh-container"></div>
        <div id="contenedor2" ref={contenedorRef2} className="bokeh-container"></div>
        <div id="contenedor3" ref={contenedorRef3} className="bokeh-container"></div>
        </div>
        <div id="contenedor4" ref={contenedorRef4} className="bokeh-container1"></div>
        </div>
    )
};

export default MetricasDashboard;