import React, { useEffect, useState } from "react";

function ProductoMasVendido() {
  const [fecha, setFecha] = useState("2023-06-30"); // Fecha predeterminada
  const [productos, setProductos] = useState([]); // Lista de productos más vendidos
  const [error, setError] = useState(null); // Estado de error

  useEffect(() => {
    fetch("http://localhost:5000/api/productos_mas_vendidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fecha }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud al servidor");
        }
        return response.json(); // Convertir la respuesta en JSON
      })
      .then((data) => {
        setProductos(data); // Actualiza el estado con la lista de productos
        setError(null); // Limpia cualquier error previo
      })
      .catch((err) => {
        console.error("Error:", err);
        setError(err.message); // Maneja el error
      });
  }, [fecha]); // Ejecutar cuando cambia la fecha

  return (
    <div id="ventas_fecha" className="ventas_fecha">
      <h2>Productos Más Vendidos</h2>
      {/* Mostrar errores si los hay */}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {/* Mostrar lista de productos */}
      {productos.length > 0 ? (
        <ul>
          {productos.map((producto, index) => (
            <li key={index}>
              <strong>{producto["Item Name"]}</strong>: {producto["Quantity Sold (kilo)"]} kilos vendidos
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay datos para la fecha seleccionada.</p>
      )}

       {/* Formulario de selección de fecha */}
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
  );
}

export default ProductoMasVendido;
