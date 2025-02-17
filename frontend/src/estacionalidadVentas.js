import React, { useEffect, useState, useRef } from "react";

function EstacionalidadVentas() {
  const [anyo, setAnyo] = useState("2023"); // Año predeterminado
  const [grafico, setGrafico] = useState(null); // Contenedor para el gráfico
  const contenedorRef = useRef(null); // Referencia al contenedor del gráfico

  useEffect(() => {
    // Solicita el gráfico al backend mediante POST al cambiar el año
    fetch("http://localhost:5000/api/estacionalidadVentas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ anyo }), // Enviar el año en el cuerpo de la solicitud
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error en la solicitud");
        return response.json();
      })
      .then((data) => {
        console.log("Datos recibidos desde el servidor (Donut):", data);
        setGrafico(data); // Guarda los datos del gráfico
        window.Bokeh.embed.embed_item(grafico, contenedorRef.current);
      })
      .catch((error) => {
        console.error("Error al cargar el gráfico:", error);
        setGrafico(null); // Limpia el gráfico en caso de error
      });
  }, [anyo]); // Ejecuta el efecto al cambiar el año

  // useEffect(() => {
  //   if (grafico && contenedorRef.current) {
  //     // Limpia el contenedor antes de agregar el gráfico
  //     contenedorRef.current.innerHTML = '';
  //     // Inserta el gráfico en el contenedor
  //     window.Bokeh.embed.embed_item(grafico, contenedorRef.current);
  //   }
  // }, [grafico]); // Solo se ejecuta cuando el gráfico cambia

  return (
    <div id="estacionalidad-ventas" className="estacionalidad-ventas">
      <h2>Estacionalidad de Ventas</h2>
      <form>
        <label htmlFor="anyo">Selecciona un año:</label>
        <select
          id="anyo"
          value={anyo}
          onChange={(e) => setAnyo(e.target.value)}
          required
        >
          <option value="2020">2020</option>
          <option value="2021">2021</option>
          <option value="2022">2022</option>
          <option value="2023">2023</option>
        </select>
      </form>

      <div id="grafico-container" className="bokeh-container" ref={contenedorRef}>
        {!grafico && <p>Selecciona un año para visualizar el gráfico.</p>}
      </div>
    </div>
  );
}

export default EstacionalidadVentas;
