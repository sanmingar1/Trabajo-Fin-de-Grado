import React, { useEffect, useState } from "react";

function Clustering() {
  const [n_clusters, setN_clusters] = useState(5);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/clustering", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ n_clusters }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Error en la solicitud");
        return response.json();
      })
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="clustering-wrapper">
      <div className="clustering">
        <h2>AGRUPACIÓN DE PRODUCTOS</h2>

        {loading && <p className="estado">Cargando grupos de productos...</p>}
        {error && <p className="estado error">Error: {error}</p>}

        {!loading && !error && data && (
          <div className="clustering-content">
            {Object.entries(data).map(([grupo, productos], index) => (
              <div key={index} className="clustering-group">
                <h3>Grupo {index + 1}</h3>
                <ul>
                  {productos.map((producto, idx) => (
                    <li key={idx}>{producto}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Clustering;
