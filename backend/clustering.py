import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics.pairwise import cosine_similarity 

def top_n(param):
    n_clusters = param.get('n_clusters')
    df = pd.read_csv('data/dataset_formateado.csv')

    #Eliminamos las entradas del dataset que hayan sido devoluciones
    df = df[df['Sale or Return'] == 'sale']

    #Creamos una columna con la fecha y hora de la transacción
    df['Date'] = df['Date'].astype(str)
    df['Datetime'] = pd.to_datetime(df['Date'] + ' ' + df['Time'])
    df = df.drop('Date',axis=1)
    df = df.drop('Time',axis=1)

    #Creamos una columna con el id de la transacción
    df['transaction_id'] =  df['Datetime'].dt.floor('min').factorize()[0] + 1
    df = df[df['transaction_id'].map(df['transaction_id'].value_counts()) > 1]

    #Creamos la matriz de productos
    product_matrix = pd.crosstab(df['transaction_id'], df['Item Code'])

    #Entrenamos el modelo y asignamos el cluster a cada transacción
    kmeans = KMeans(n_clusters=15,random_state=42)
    product_matrix['Cluster'] = kmeans.fit_predict(product_matrix)

    #Creamos un dataframe con los centroides de cada cluster asociados a los productos
    centroides = kmeans.cluster_centers_
    product_matrix1 = product_matrix.drop('Cluster',axis=1)
    dataframe = pd.DataFrame(centroides, columns= product_matrix1.columns)

    dicc = dict()
    for cluster_id in range(n_clusters):
        top_products = dataframe.iloc[cluster_id].nlargest(5)  # Selecciona los 5 productos más vendidos
        dicc[cluster_id] = top_products.to_dict()

    dicc1 = dict()

    for cluster in dicc:
        for codigo_producto in dicc[cluster]:
            nombre_producto = df.loc[df['Item Code'] == codigo_producto, 'Item Name'].values[0]
            if cluster not in dicc1:
                dicc1[cluster] = [nombre_producto]
            else:
                dicc1[cluster].append(nombre_producto)

    return dicc1