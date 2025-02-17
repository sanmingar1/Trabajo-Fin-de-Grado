import React,{useEffect,useRef,useState} from "react";
    

   

       

function SelectorGrafica(){
    let [param,setParam] = useState('')
    const contenedorRef4 = useRef(null); // Referencia al cuarto contenedor
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
        <div id='SelectorGrafica' className="SelectorGrafica">
            <form>
                <label>Selecciona Que Visualizar</label>
                <select
                value = {param}
                onChange={(e) => setParam(e.target.value)}
                required>
                    <option value='Categoria'>Categorías</option>
                    {/* <option value='Categoria'>Categorías</option> */}
                </select>
            </form>
            <div id="contenedor4" ref={contenedorRef4} className="bokeh-container2"></div>
        </div>
    );
    
};

export default SelectorGrafica;