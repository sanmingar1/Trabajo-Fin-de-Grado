import React, { useEffect, useState } from "react";

function NumeroDevoluciones({ fecha_seleccionada }) {
  const [info, setInfo] = useState(null); // Respuesta del servidor

  useEffect(() => {
    if (!fecha_seleccionada) return; // Previene llamadas con valores no válidos

    fetch("http://localhost:5000/api/numero_devoluciones_fecha", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fecha: fecha_seleccionada })
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error en la solicitud");
        return response.json();
      })
      .then((data) => {
        console.log("Json recibido desde el servidor:", data);
        setInfo(data);
      })
      .catch((error) => console.error("Error:", error));
  }, [fecha_seleccionada]); // Se ejecuta cuando cambia `fecha_seleccionada`

  return (
    <div id="numero_devoluciones" className="numero_devoluciones">
      { (
        <div className="numero-devoluciones-result">
          <h3>Número de Devoluciones</h3>
          <p>{info}</p>
        </div>
      )}
    </div>
  );
}

export default NumeroDevoluciones;