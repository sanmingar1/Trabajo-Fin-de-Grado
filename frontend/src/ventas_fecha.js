import React, { useEffect, useState } from "react";

function VentasPorFecha({fecha_seleccionada}) {
  const [info, setInfo] = useState(null); // Respuesta del servidor

  useEffect(() => {
        fetch("http://localhost:5000/api/ventas_fecha", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fecha: fecha_seleccionada })
    })
        .then((response) => {
            if (!response.ok) throw new Error('Error en la solicitud');
            return response.json();
        })
        .then((data) => {
            console.log('Json recibido desde el servidor:', data);
            setInfo(data);
        })
        .catch((error) => console.error('Error:', error));
     }, [fecha_seleccionada]);


  return (
    <div id="ventas_fecha" className="ventas_fecha">
         {info && (
        <div className="ventas-fecha-result">
          <h3>Resultado de Ventas</h3>
          <p>{info}€</p>
          </div>
      )}
   
     
    </div>
  );
}

export default VentasPorFecha;
