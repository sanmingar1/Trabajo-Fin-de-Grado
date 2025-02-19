from flask import Flask, Response
import json
from bokeh.embed import json_item
from bokeh.plotting import figure, show
import pandas as pd
from bokeh.models import ColumnDataSource
from bokeh.layouts import column

def crear_prueba_grafica_grande(params):
    df = pd.read_csv('data/dataset_formateado.csv')

    tipo_grafica = params['tipo_grafica']
    fecha = params['fecha']
    if tipo_grafica == 'ventas_diarias_totales':
        # Convertir la columna de fecha a formato datetime
        df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
        # Agrupar las ventas diarias
        daily_sales = df.groupby('Date')['Quantity Sold (kilo)'].sum().reset_index()
        # Preparar los datos para Bokeh
        source = ColumnDataSource(daily_sales)
        # Crear el gráfico de barras
        p = figure(x_axis_type="datetime", title="Ventas Diarias Totales (kg)", height=400, width=600,
                x_axis_label="Fecha", y_axis_label="Cantidad Vendida (kg)")

        p.vbar(x='Date', top='Quantity Sold (kilo)', width=0.9, source=source, color="dodgerblue")
        p.xgrid.grid_line_color = None
        p.y_range.start = 0
    elif tipo_grafica == 'productos_mas_vendidos':
        # Productos más vendidos (gráfico de barras)

        # Agrupar las ventas por producto
        product_sales = df.groupby('Item Name')['Quantity Sold (kilo)'].sum().reset_index()

        # Ordenar de mayor a menor
        product_sales = product_sales.sort_values(by='Quantity Sold (kilo)', ascending=False).head(10)

        # Preparar los datos para Bokeh
        source = ColumnDataSource(product_sales)

        # Crear el gráfico de barras
        p = figure(x_range=product_sales['Item Name'], title="Top 10 Productos Más Vendidos (kg)", 
                    height=400, width=600, x_axis_label="Producto", y_axis_label="Cantidad Vendida (kg)")

        p.vbar(x='Item Name', top='Quantity Sold (kilo)', width=0.9, source=source, color="forestgreen")

        p.xgrid.grid_line_color = None
        p.y_range.start = 0
        p.xaxis.major_label_orientation = 1.2
    elif tipo_grafica == 'media-ventas-hora':
        df['Time'] = pd.to_datetime(df['Time'], errors='coerce')

        # Extraer la hora para el histograma
        df['Hour'] = df['Time'].dt.hour

        # Agrupar las ventas por hora
        hourly_sales = df.groupby('Hour')['Quantity Sold (kilo)'].sum().reset_index()

        # Preparar los datos para Bokeh
        source = ColumnDataSource(hourly_sales)

        # Crear el histograma
        p = figure(title="Distribución de Ventas por Hora (kg)", height=400, width=600, 
                    x_axis_label="Hora del Día", y_axis_label="Cantidad Vendida (kg)")

        p.vbar(x='Hour', top='Quantity Sold (kilo)', width=0.9, source=source, color="coral")

        p.xgrid.grid_line_color = None
        p.y_range.start = 0

    grafica = json.dumps(json_item(p,'contenedor'))
    return Response(grafica, mimetype='application/json')