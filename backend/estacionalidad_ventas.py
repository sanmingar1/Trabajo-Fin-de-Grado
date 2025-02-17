from math import pi
import pandas as pd
import json
from bokeh.embed import json_item
from flask import Response
from bokeh.palettes import Category20c
from bokeh.plotting import figure, show
from bokeh.transform import cumsum
from bokeh.models import ColumnDataSource

def devuelve_estacionalidad_ventas(param):
    # Obtener el año de los parámetros
    anyo = int(param.get('anyo'))

    # Leer el dataset y convertir la columna Date
    dataset = pd.read_csv("data/dataset_formateado.csv")
    dataset['Date'] = pd.to_datetime(dataset['Date'])  # Convertir a tipo datetime

    # Verificar que 'Item Name' existe en el dataset
    if 'Item Name' not in dataset.columns:
        return Response("Error: 'Item Name' no se encuentra en el dataset", status=500)

    # Filtrar por año
    df = dataset[dataset['Date'].dt.year == anyo]

    # Asignar estación del año según el mes
    def asignar_estacion(mes):
        if mes in [12, 1, 2]:
            return 'Invierno'
        elif mes in [3, 4, 5]:
            return 'Primavera'
        elif mes in [6, 7, 8]:
            return 'Verano'
        elif mes in [9, 10, 11]:
            return 'Otoño'

    # Crear una nueva columna 'Estacion' en base a la columna 'Date'
    df['Estacion'] = df['Date'].dt.month.apply(asignar_estacion)

    # Agrupar por estación y nombre del producto, y sumar las cantidades vendidas
    ventas_por_estacion = df.groupby(['Estacion', 'Item Name'])['Quantity Sold (kilo)'].sum()

    # Encontrar el producto más vendido por estación
    mas_vendidos = ventas_por_estacion.groupby('Estacion').idxmax()
    cantidades = ventas_por_estacion[mas_vendidos].reset_index()
    cantidades.columns = ['Estacion', 'Item Name', 'Cantidad']

    # Limitar la longitud de los nombres a 50 caracteres para evitar que sean demasiado largos
    cantidades['Item Name'] = cantidades['Item Name'].apply(lambda x: x[:50] + '...' if len(x) > 50 else x)

    # Crear una nueva columna para los tooltips con el formato deseado
    cantidades['Tooltip'] = cantidades['Item Name'] + ": " + cantidades['Cantidad'].astype(str) + " kilos"

    # Preparar los datos para el gráfico
    colores_estaciones = {
        'Invierno': '#3498db',
        'Primavera': '#2ecc71',
        'Verano': '#f1c40f',
        'Otoño': '#e67e22'
    }

    cantidades['Color'] = cantidades['Estacion'].map(colores_estaciones)
    cantidades['Angulo'] = cantidades['Cantidad'] / cantidades['Cantidad'].sum() * 2 * pi

    # Convertir el DataFrame en un ColumnDataSource
    source = ColumnDataSource(cantidades)

    # Crear el gráfico de tarta
    p = figure(height=350, title=f"Estacionalidad de Ventas ({anyo})", toolbar_location=None,
               tools="hover", tooltips="@Tooltip", x_range=(-0.5, 1.0))

    p.wedge(x=0, y=1, radius=0.4,
            start_angle=cumsum('Angulo', include_zero=True), end_angle=cumsum('Angulo'),
            line_color="white", fill_color='Color', legend_field='Estacion',
            source=source)  

    p.axis.axis_label = None
    p.axis.visible = False
    p.grid.grid_line_color = None
    grafica = json.dumps(json_item(p,'contenedor'))
    return Response(grafica, mimetype='application/json')
