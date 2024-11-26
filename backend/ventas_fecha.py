import pandas as pd
from flask import jsonify

def devolver_ventas_fecha(param):
    fecha = param.get('fecha')
    dataset = pd.read_csv('./data/dataset_formateado.csv')
    dataset['Date'] = pd.to_datetime(dataset['Date'])

    # Filtrar el dataset para la fecha específica
    dataset_filtrado = dataset[dataset['Date'] == fecha]

    # Calcular el dinero total y redondearlo a dos decimales
    dinero_total = sum(dataset_filtrado['Unit Selling Price (EUR/kg)'] * dataset_filtrado['Quantity Sold (kilo)'])
    dinero_total_redondeado = round(dinero_total, 2)

    return jsonify(dinero_total_redondeado)
