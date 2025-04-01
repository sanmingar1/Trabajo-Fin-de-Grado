import React, { useState, useEffect, useRef } from "react";

function PrediccionStock() {
    const [intervalo, setIntervalo] = useState("");
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState("");
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [loadingPrediccion, setLoadingPrediccion] = useState(false);
    const [prediccion, setPrediccion] = useState(null);
    const [mostrarSugerencias, setMostrarSugerencias] = useState(false);
    const listaRef = useRef(null);

    // Cargar lista de productos desde el backend
    useEffect(() => {
        fetch("http://localhost:5000/api/lista_productos")
            .then((response) => {
                if (!response.ok) throw new Error("Error al cargar la lista de productos.");
                return response.json();
            })
            .then((data) => setProductos(data.productos))
            .catch((error) => console.error("Error:", error));
    }, []);

    // Manejar selección de intervalo
    const handleIntervaloChange = (e) => {
        setIntervalo(e.target.value);
        setProductoSeleccionado(null);
        setBusqueda("");
        setMostrarSugerencias(false);
    };

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
        if (!intervalo) {
            alert("Por favor, selecciona un intervalo.");
            return;
        }

        if (!productoSeleccionado) {
            alert("Por favor, selecciona un producto válido.");
            return;
        }

        setLoadingPrediccion(true);
        

        try {
            const response = await fetch("http://localhost:5000/api/prediccion_stock1", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ intervalo, producto: productoSeleccionado }),
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

    return (
        <div className="prediccion_stock">
            <div className="prediccion_stock_arriba">
            <div className="texto-prediccion">
                <h2>PREDICCIÓN DE STOCK</h2>
            </div>

            <div className="boton-y-selector-prediccion">
                <form>
                    <select value={intervalo} onChange={handleIntervaloChange}>
                        <option value="">Seleccione Cuando Predecir</option>
                        <option value="Diariamente">Mañana</option>
                        <option value="Semanalmente">Próxima Semana</option>
                        <option value="Mensualmente">Próximo Mes</option>
                    </select>
                </form>

                {/* Mostrar el buscador solo si hay un intervalo seleccionado */}
                {intervalo && (
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
                    <h3>Resultados de la predicción:</h3>
                    <h3>{"Predicción: "+(Math.trunc(prediccion.prediccion_futura * 100) / 100) + " kg"}</h3>
                    <h3>{"MAE Error: "+(Math.trunc(prediccion.mae * 100) / 100) + " kg"}</h3>
                    <h3>{"RMSE Error: "+(Math.trunc(prediccion.rmse * 100) / 100) + " kg"}</h3>

                </div>
            )}
        </div>
    );
}

export default PrediccionStock;
