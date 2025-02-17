import React, { useEffect, useState } from "react";

function NumeroDevoluciones() {
  const [fecha, setFecha] = useState("2023-06-30"); // Fecha predeterminada
  const [info, setInfo] = useState(null); // Respuesta del servidor

  useEffect(() => {
        fetch("http://localhost:5000/api/numero_devoluciones_fecha", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ fecha })
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
     }, []);


  return (
    <div id="ventas_fecha" className="ventas_fecha">
         {info && (
        <div id="info">
          <h3>Número de Devoluciones</h3>
          <p>{info}</p>
          </div>
      )}
      <form>
        <input
          type="date"
          id="fecha"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          min="2020-07-01" 
          max="2023-06-30" 
          required
        />
      </form>
      
     
    </div>
  );
}

export default NumeroDevoluciones;
