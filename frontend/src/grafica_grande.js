import React,{useEffect,useRef,useState} from "react";

function SelectorGrafica(){
    let [tipoGrafica,setTipoGrafica] = useState('')
    let [fechaInicio,setFechaInicio] = useState('')
    let [fechaFin,setFechaFin] = useState('')
    const contenedorRef4 = useRef(null); // Referencia al cuarto contenedor
    
    useEffect(() => {
            fetch('http://localhost:5000/api/prueba_grafica_grande',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({tipo_grafica: tipoGrafica,fechaInicio: fechaInicio,fechaFin: fechaFin}),
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
        }, [tipoGrafica,fechaInicio,fechaFin]);

    return (
        <div id='columna_izquierda_inferior-grafica-selector' className="columna_izquierda_inferior-grafica-selector">
            <div className='selectores'>
            <form>
                <label>Selecciona Gráfica</label>
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
            {tipoGrafica === 'productos_mas_vendidos' && (
                <div className='selectores-fecha-grafica-grande'>
                <form>
                    <label>Fecha Inicio</label>
                    <input
                    type='date'
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    min="2020-07-01" // Fecha mínima
                    max="2023-06-30" // Fecha máxima
                    required
                    />
                </form>
                <form>
                    <label>Fecha Fin</label>
                    <input
                    type='date'
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    min="2020-07-01" // Fecha mínima
                    max="2023-06-30" // Fecha máxima
                    required
                    />
                </form>
                </div>
            ) }
            </div>
            <div id="columna_izquierda_inferior_grafica" ref={contenedorRef4} className="columna_izquierda_inferior_grafica"></div>
        </div>
    );
    
};

export default SelectorGrafica;