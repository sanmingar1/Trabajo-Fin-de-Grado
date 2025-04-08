from flask import jsonify,Response
import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error

def recortar_cola_muerta(df, umbral_ceros=0.95, dias=45):

    if len(df) < dias:
        return df.copy()  # no hay suficientes datos para evaluar
    
    while(len(df) >= dias):
        ultimos_dias = df.tail(dias)
        porcentaje_ceros = (ultimos_dias['Kilos'] == 0).sum() / dias

        if porcentaje_ceros > umbral_ceros:
            fecha_limite = df.iloc[-dias - 1]['Fecha']
            df = df[df['Fecha'] <= fecha_limite]
        else:
            break
   

    return df.reset_index(drop=True)


def predecir_stock(params):
    
    try:
        producto = params.get('producto')
        
        #Cargar dataset con manejo de errores
        try:
            df = pd.read_csv('data/dataset_formateado.csv',parse_dates=['Date'])
        except FileNotFoundError:
            return jsonify({"error": "Archivo dataset_formateado.csv no encontrado"}), 500


        df1 = df[['Item Name', 'Date', 'Quantity Sold (kilo)']]
        df_grouped = df1.groupby(['Item Name', 'Date']).agg({'Quantity Sold (kilo)': 'sum'}).reset_index()
        df_grouped.columns = ['Producto', 'Fecha', 'Kilos']

        df_grouped = df_grouped.sort_values('Fecha')

        # Filtrar por producto
        df_prod = df_grouped[df_grouped['Producto'] == producto]

        # Rango de fechas
        fecha_inicio = df_prod['Fecha'].min()
        fecha_fin = df_prod['Fecha'].max()
        df_fecha = pd.DataFrame({'Fecha': pd.date_range(fecha_inicio, fecha_fin, freq='D')})

        # Merge fechas completas
        df_completo = df_fecha.merge(df_prod, on='Fecha', how='left')
        df_completo['Kilos'] = df_completo['Kilos'].fillna(0)
        df_completo['Producto'] = producto  # Aseguramos que todas las filas tengan el nombre del producto

        df_completo['dia_semana'] = df_completo['Fecha'].dt.weekday           # 0 (lunes) a 6 (domingo)
        df_completo['mes'] = df_completo['Fecha'].dt.month                    # 1 a 12
        df_completo['dia_mes'] = df_completo['Fecha'].dt.day                  # 1 a 31
        df_completo['dia_anyo'] = df_completo['Fecha'].dt.dayofyear           # 1 a 365/366
        df_completo['semana_anyo'] = df_completo['Fecha'].dt.isocalendar().week
        df_completo['fin_de_semana'] = df_completo['dia_semana'].isin([5, 6]).astype(int)  # 1 si sábado o domingo

        features = ['Kilos', 'dia_semana', 'mes', 'dia_mes', 'dia_anyo', 'semana_anyo', 'fin_de_semana']

        df_sin_ruido = recortar_cola_muerta(df_completo)
        df_feat = df_sin_ruido[features].values   
        target = df_sin_ruido['Kilos'].values    

        window_size = 7
        train_size = 0.65


        X_train, y_train, X_test, y_test = [], [], [], []

# Asegurar que tienes suficientes datos
        if len(df_feat) >= window_size + 1:
    
            # Separar antes de ventanear
            split_idx = int(len(df_feat) * train_size)
            feat_train = df_feat[:split_idx]
            feat_test = df_feat[split_idx - window_size:]  # incluir la ventana previa

            target_train = target[:split_idx]
            target_test = target[split_idx - window_size:]

            # Ventanas para entrenamiento
            for i in range(len(feat_train) - window_size):
                X_train.append(feat_train[i:i+window_size])
                y_train.append(target_train[i+window_size])

            # Ventanas para test
            for i in range(len(feat_test) - window_size):
                X_test.append(feat_test[i:i+window_size])
                y_test.append(target_test[i+window_size])

            # Convertir a arrays finales
            X_train = np.array(X_train)
            y_train = np.array(y_train)
            X_test = np.array(X_test)
            y_test = np.array(y_test)

        else:
            return jsonify({"No hay suficientes datos para generar ventanas."})
            

        X_train_flat = X_train.reshape(X_train.shape[0], -1)
        X_test_flat = X_test.reshape(X_test.shape[0], -1)

        # Crear y entrenar modelo
        modelo = XGBRegressor(n_estimators=200, random_state=42)
        modelo.fit(X_train_flat, y_train)

        # Predicción
        y_pred = modelo.predict(X_test_flat)


        # Errores
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))

        ultima_ventana = df_feat[-window_size:]
        ultima_ventana = ultima_ventana.reshape(1, -1)  # convertir a forma (1, window_size * n_features)

        # Hacer la predicción futura
        prediccion_futura = modelo.predict(ultima_ventana)[0]



        #Convertir datos antes de enviar JSON
        return jsonify({
            "producto": producto,
            "mae": float(mae),  # Convertimos a float estándar para evitar errores de JSON
            "rmse": float(rmse),  # Convertimos a float estándar para evitar errores de JSON
            "prediccion_futura": float(prediccion_futura)  # Convertimos la predicción futura
        })

    except Exception as e:
        return jsonify({"error": +str(e)}), 500
    

