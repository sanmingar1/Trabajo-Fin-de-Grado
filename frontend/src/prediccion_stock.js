import React, { useState, useEffect, useRef } from "react";

function PrediccionStock() {
    // const [intervalo, setIntervalo] = useState("");
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [loadingPrediccion, setLoadingPrediccion] = useState(false);
    const [prediccion, setPrediccion] = useState(null);
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    const listaRef = useRef(null);
    const [mostrarModalGrafico, setMostrarModalGrafico] = useState(false);
    const contenedorGraficoRef = useRef(null);
    const [graficoVentas, setGraficoVentas] = useState(null);

    // Cargar lista de productos desde el backend
    // useEffect(() => {
    //     fetch("http://localhost:5000/api/lista_productos")
    //         .then((response) => {
    //             if (!response.ok) throw new Error("Error al cargar la lista de productos.");
    //             return response.json();
    //         })
    //         .then((data) => setProductos(data.productos))
    //         .catch((error) => console.error("Error:", error));
    // }, []);

    // Lista de productos obtenidad a través del cuaderno de Jupyter
    // Son los porductos que tienen que tienen mas de 1000 datos
    const lista_productos = ['7 Colour Pepper (1)', 'Amaranth', 'Apricot Bao Mushroom (1)',
        'Bell Pepper (1)', 'Broccoli', 'Caixin', 'Chinese Cabbage',
        'Chinese Caterpillar Fungus Flowers', 'Eggplant (2)',
        'Foreign Garland Chrysanthemum ', 'Green Eggplant (1)',
        'Green Hot Peppers', 'High Melon (1)', 'Honghu Lotus Root',
        'Hongshujian', 'Huangbaicai (2)', 'Luosi Pepper', 'Millet Pepper',
        'Muercai', 'Naibaicai', 'Net Lotus Root (1)', 'Perilla',
        'Qinggengsanhua', 'Red Lotus Root Zone', 'Round Eggplant (2)',
        'Shanghaiqing', 'Spinach', 'The Red Bell Pepper (1)',
        'The White Mushroom (Bag)', 'Water Chestnut (Lingjiao)', 'Wawacai',
        'Wild Lotus Root (1)', 'Wuhu Green Pepper (1)',
        'Xixia Black Mushroom (1)', 'Yellow Xincai (1)', 'Yunnan Lettuces',
        'Yunnan Shengcai', 'Zhuyecai'];

        
        useEffect(() => {
            setProductos(lista_productos);
          }, []);
          



    // Manejar cambios en la búsqueda con restricción de caracteres
    const handleBusquedaChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z0-9\s]/g, ""); // Evita caracteres especiales
        setBusqueda(value);
        setMostrarSugerencias(true);
    };

    // Filtrar productos según búsqueda
    const productosFiltrados = productos.filter((producto) =>
        producto.toLowerCase().includes(busqueda.toLowerCase())
    );

    // Seleccionar un producto desde las sugerencias
    const seleccionarProducto = (producto) => {
        setProductoSeleccionado(producto);
        setBusqueda(producto);
        setMostrarSugerencias(false);
    };

    // Mostrar gráfico de ventas
    const mostrarGraficoVentas = (producto) => {
        setGraficoVentas(producto);

    };

    useEffect(() => {
    if (mostrarModalGrafico && graficoVentas && contenedorGraficoRef.current) {
        contenedorGraficoRef.current.innerHTML = '';
        window.Bokeh.embed.embed_item(graficoVentas, contenedorGraficoRef.current);
    }
    }, [mostrarModalGrafico, graficoVentas]);



    // Ocultar las sugerencias si se hace clic fuera del buscador
    useEffect(() => {
        const handleClickFuera = (e) => {
            if (listaRef.current && !listaRef.current.contains(e.target)) {
                setMostrarSugerencias(false);
            }
        };
        document.addEventListener("mousedown", handleClickFuera);
        return () => {
            document.removeEventListener("mousedown", handleClickFuera);
        };
    }, []);

    // Manejar generación de predicción con validación de entrada
    const generarPrediccion = async () => {

        if (!productoSeleccionado) {
            alert("Por favor, selecciona un producto válido.");
            return;
        }

        setLoadingPrediccion(true);
        

        try {
            const response = await fetch("http://localhost:5000/api/prediccion_stock1", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ /*intervalo, */producto: productoSeleccionado }),
            });
            if (!response.ok) throw new Error("Error al generar la predicción.");

            const result = await response.json();
            setPrediccion(result);
        } catch (error) {
            console.error("Error en la predicción:", error);
            alert("Ocurrió un error al generar la predicción.");
        } finally {
            setLoadingPrediccion(false);
        }
    };


    // Modal y Bokeh embebido sin bug visual
useEffect(() => {
    if (mostrarModalGrafico && productoSeleccionado) {
        fetch("http://localhost:5000/api/prediccion_stock1", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ producto: productoSeleccionado, grafica: true,y_pred: prediccion.y_pred }),
        })
        .then((res) => {
            if (!res.ok) throw new Error("Error al cargar gráfico");
            return res.json();
        })
        .then((graficoData) => {
            setTimeout(() => {
                if (contenedorGraficoRef.current) {
                    contenedorGraficoRef.current.innerHTML = "";
                    window.Bokeh.embed.embed_item(graficoData, contenedorGraficoRef.current);
                }
            }, 50); // Delay para asegurar que el DOM esté renderizado completamente
        })
        .catch((err) => {
            console.error("Error al cargar el gráfico:", err);
        });
    }
    }, [mostrarModalGrafico, productoSeleccionado]);

    useEffect(() => {
        if (mostrarModalGrafico) {
            document.body.classList.add("modal-abierto");
        } else {
            document.body.classList.remove("modal-abierto");
        }
    }, [mostrarModalGrafico]);



    return (
        <div className="prediccion_stock">
            <div className="prediccion_stock_arriba">
            <div className="texto-prediccion">
                <h2>PREDICCIÓN DE STOCK</h2>
            </div>

            <div className="boton-y-selector-prediccion">
                { (
                    <div className="buscador-productos" ref={listaRef}>
                        <input
                            type="text"
                            placeholder="Buscar producto..."
                            value={busqueda}
                            onChange={handleBusquedaChange}
                            onFocus={() => setMostrarSugerencias(true)}
                        />
                        {mostrarSugerencias && productosFiltrados.length > 0 && (
                            <ul className="lista-productos">
                                {productosFiltrados.slice(0, 5).map((producto, index) => (
                                    <li key={index} onClick={() => seleccionarProducto(producto)}>
                                        {producto}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {productoSeleccionado && (
                    <p>Producto seleccionado: <strong>{productoSeleccionado}</strong></p>
                )}

                <button onClick={generarPrediccion} disabled={loadingPrediccion}>
                    {loadingPrediccion ? "Generando..." : "Generar predicción"}
                </button>
            </div>
            </div>
            {prediccion && (
                <div className="resultado-prediccion">
                    <h3>{prediccion.producto}</h3>
                    <h3>{"Mañana se venderán: "+(Math.trunc(prediccion.prediccion_futura * 100) / 100) + "  kg ± " + (Math.trunc(prediccion.mae * 100) / 100) +  " kg"}</h3>
                    {/* <h3>{"MAE Error: "+(Math.trunc(prediccion.mae * 100) / 100) + " kg"}</h3> */}
                    {/* <h3>{"RMSE Error: "+(Math.trunc(prediccion.rmse * 100) / 100) + " kg"}</h3> */}
                    
                   <button className="boton-mostrar-grafico"
                    onClick={() => setMostrarModalGrafico(true)}>Mostrar Gráfico</button>

                    {mostrarModalGrafico && (
                    <div className="modal-overlay">
                        <div className="modal-contenido">
                            <button className="cerrar-modal" onClick={() => setMostrarModalGrafico(false)}>X</button>
                            <div ref={contenedorGraficoRef}></div>
                        </div>
                    </div>
                     )}

                </div>
            )}
        </div>
    );
}

export default PrediccionStock;
