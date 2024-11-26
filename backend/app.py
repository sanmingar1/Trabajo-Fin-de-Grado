from flask_cors import CORS
from flask import Flask,request
from prueba import crear_prueba
from ventas_fecha import devolver_ventas_fecha
from prueba_grafica_grande import crear_prueba_grafica_grande

app = Flask(__name__)

CORS(app)


@app.route('/api/prueba', methods = ['GET'])
def prueba():
    return crear_prueba()

@app.route('/api/prueba_grafica_grande', methods = ['GET'])
def prueba_grafica_grande():
    return crear_prueba_grafica_grande()


@app.route('/api/ventas_fecha', methods = ['POST'])
def ventas_fecha():
    param = request.get_json()
    return devolver_ventas_fecha(param)


if __name__ == "__main__":
    app.run(port=5000, debug=False)
