import React,{useEffect,useRef,useState} from "react";

function SelectorGrafica(){
    let [tipoGrafica,setTipoGrafica] = useState('')
    let [fecha,setFecha] = useState('')
    const contenedorRef4 = useRef(null); // Referencia al cuarto contenedor
    
    useEffect(() => {
            fetch('http://localhost:5000/api/prueba_grafica_grande',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({tipo_grafica: tipoGrafica,fecha: fecha}),
            })
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
        }, [tipoGrafica,fecha]);

    return (
        <div id='columna_izquierda_inferior-grafica-selector' className="columna_izquierda_inferior-grafica-selector">
            <form>
                <label>Selecciona Qué Visualizar</label>
                <select
                value = {tipoGrafica}
                onChange={(e) => setTipoGrafica(e.target.value)}
                required>
                    <option value=''></option>
                    <option value='ventas_diarias_totales'>Ventas Diarias Totales</option>
                    <option value='productos_mas_vendidos'>Productos Más Vendidos</option>
                    <option value='total-ventas-hora'>Total Kilos Vendidos Por Hora</option>
                    
                    {/* <option value='precio-medio-categoria'>Evolución Precio Medio Por Categoría</option> */}


                    
                </select>
            </form>
            <div id="columna_izquierda_inferior_grafica" ref={contenedorRef4} className="columna_izquierda_inferior_grafica"></div>
        </div>
    );
    
};

export default SelectorGrafica;