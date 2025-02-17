from flask import jsonify
import pandas as pd


def devolver_productos_mas_vendidos(param):
    fecha = param.get('fecha')
    dataset = pd.read_csv('data/dataset_formateado.csv')

    dataset['Date'] = pd.to_datetime(dataset['Date'])

    dataset_filtrado = dataset[dataset['Date'] == fecha]

    productos_por_venta = (dataset_filtrado.groupby('Item Name')['Quantity Sold (kilo)']
        .sum()
        .reset_index()
        .sort_values(by='Quantity Sold (kilo)',ascending=False)
        .head(3))
    productos_json = productos_por_venta.to_dict(orient='records')
    return jsonify(productos_json)




