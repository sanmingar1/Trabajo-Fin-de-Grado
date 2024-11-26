import json
from bokeh.plotting import figure,show
from flask import jsonify, Response
import pandas as pd
from bokeh.embed import json_item

def crear_prueba_grafica_grande():
    dataset = pd.read_csv('.\data\dataset_formateado.csv')
    # print(dataset.head())
    dataset = dataset[dataset['Sale or Return'] == 'sale']

    grouped_data = dataset.groupby('Category Name')['Quantity Sold (kilo)'].sum().reset_index()
    
    p = figure(
        x_range=grouped_data['Category Name'],  # Categorías en el eje x
        height=500,
        width=1750,
        title="Cantidad Vendida por Categoría",
        toolbar_location=None,
        tools=""
    )

# Añadir las barras
    p.vbar(
        x=grouped_data['Category Name'],
        top=grouped_data['Quantity Sold (kilo)'],
        width=0.8,
        color="dodgerblue"
    )
    # Personalizar la gráfica
    p.xgrid.grid_line_color = None
    p.y_range.start = 0
    p.xaxis.major_label_orientation = "vertical"
    p.xaxis.axis_label = "Categorías"
    p.yaxis.axis_label = "Cantidad Vendida (Kilos)"
    
    grafica = json.dumps(json_item(p,'contenedor'))
    return Response(grafica,mimetype='application/json')