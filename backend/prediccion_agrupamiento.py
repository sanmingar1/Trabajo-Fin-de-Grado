import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics.pairwise import cosine_similarity 

# def lista_por_agrupamiento(param):
    # Leer el dataset
df = pd.read_csv('dataset_formateado.csv')

df = df[df['Sale or Return'] == 'sale']

df['Date'] = df['Date'].astype(str)
df['Datetime'] = pd.to_datetime(df['Date'] + ' ' + df['Time'])
df = df.drop('Date',axis=1)
df = df.drop('Time',axis=1)

df['transaction_id'] =  df['Datetime'].dt.floor('min').factorize()[0] + 1

df = df[df['transaction_id'].map(df['transaction_id'].value_counts()) > 1]

product_matrix = pd.crosstab(df['transaction_id'], df['Item Code'])

co_occurrence_matrix = product_matrix.T.dot(product_matrix)

scaler = cosine_similarity(co_occurrence_matrix)

k = 13
kmeans = KMeans(n_clusters=k, random_state=42)
kmeans.fit(scaler)


