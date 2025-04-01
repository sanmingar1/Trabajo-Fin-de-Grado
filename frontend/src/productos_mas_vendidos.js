import React, { useEffect, useState } from "react";

function ProductoMasVendido({ fecha_seleccionada }) {
  const [productos, setProductos] = useState([]); // Lista de productos más vendidos
  const [error, setError] = useState(null); // Estado de error

  useEffect(() => {
    if (!fecha_seleccionada) return; // Previene llamadas con valores no válidos

    fetch("http://localhost:5000/api/productos_mas_vendidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fecha: fecha_seleccionada }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error en la solicitud al servidor");
        }
        return response.json();
      })
      .then((data) => {
        setProductos(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error:", err);
        setError(err.message);
      });
  }, [fecha_seleccionada]); // Se ejecuta cuando cambia `fecha_seleccionada`

  return (
    <div id="productos_mas_vendidos" className="productos_mas_vendidos">
      <h3>Productos Más Vendidos</h3>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

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
    </div>
  );
}

export default ProductoMasVendido;
  