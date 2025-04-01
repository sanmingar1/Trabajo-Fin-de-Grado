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
                console.log("JSON recibido desde el servidor:", data);
                setData(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error:", error);
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Cargando grupos de productos...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="clustering">
            <h2>PRODUCTOS COMPRADOS JUNTOS</h2>
            {data &&
                Object.values(data).map((productos, index) => (
                    <div key={index} className="clustering-group">
                        <p>{productos.join(", ")}</p>
                    </div>
                ))}
        </div>
    );
}

export default Clustering;
