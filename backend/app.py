from flask_cors import CORS
from flask import Flask,request
import pandas as pd
from prueba import crear_prueba
from ventas_fecha import devolver_ventas_fecha
from grafica_grande import crear_prueba_grafica_grande
from productos_mas_vendidos import devolver_productos_mas_vendidos
from numero_devoluciones_fecha import devolver_numero_devoluciones_fecha
from estacionalidad_ventas import devuelve_estacionalidad_ventas
from clustering import top_n
from prediccion_stock import predecir_stock

app = Flask(__name__)

CORS(app)


@app.route('/api/prueba', methods = ['GET'])
def prueba():
    return crear_prueba()

@app.route('/api/prueba_grafica_grande', methods = ['POST'])
def prueba_grafica_grande():
    params = request.get_json()
    return crear_prueba_grafica_grande(params)


@app.route('/api/ventas_fecha', methods = ['POST'])
def ventas_fecha():
    param = request.get_json()
    return devolver_ventas_fecha(param)

@app.route('/api/productos_mas_vendidos',methods = ['POST'])
def productos_mas_vendidos():
    param = request.get_json()
    return devolver_productos_mas_vendidos(param)

@app.route('/api/numero_devoluciones_fecha',methods = ['POST'])
def numero_devoluciones_fecha():
    param = request.get_json()
    return devolver_numero_devoluciones_fecha(param)

@app.route('/api/estacionalidadVentas',methods = ['POST'])
def estacionalidadVentas():
    param = request.get_json()
    return devuelve_estacionalidad_ventas(param)

@app.route('/api/clustering', methods = ['POST'])
def clustering():
    param = request.get_json()
    return top_n(param)


@app.route('/api/prediccion_stock1', methods = ['POST'])
def prediccion_stock1():
    param = request.get_json()
    return predecir_stock(param)

@app.route('/api/lista_productos', methods = ['GET'])
def lista_productos():
    df = pd.read_csv('data/dataset_formateado.csv')
    productos = df['Item Name'].unique()
    return {'productos': productos.tolist()}

if __name__ == "__main__":
    app.run(port=5000, debug=False)
