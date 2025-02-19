import pandas as pd
from flask import jsonify

def devolver_numero_devoluciones_fecha(param):
    fecha = param.get('fecha')
    dataset = pd.read_csv('data/dataset_formateado.csv')

    dataset['Date'] = pd.to_datetime(dataset['Date'])

    dataset_filtrado = dataset[dataset['Date'] == fecha]

    numero_devoluciones = dataset_filtrado[dataset_filtrado['Sale or Return'] == 'return'].shape[0]
    return jsonify(numero_devoluciones)
