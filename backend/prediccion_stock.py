import pandas as pd
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.optimizers import Adam
from flask import jsonify




def predecir_stock(params):
    
    try:
        producto_objetivo = params.get('producto')
        
        #Cargar dataset con manejo de errores
        try:
            df = pd.read_csv('data/dataset_formateado.csv',parse_dates=['Date'])
        except FileNotFoundError:
            return jsonify({"error": "Archivo dataset_formateado.csv no encontrado"}), 500




        # --- 1. Cargar datos ---
        df = df[df['Sale or Return'] == 'sale']
        df1 = df[['Item Name', 'Date', 'Quantity Sold (kilo)']]
        df1['Date'] = pd.to_datetime(df1['Date'])
        df1 = df1.sort_values(by='Date')

        df_grouped = df1.groupby(['Item Name', 'Date']).agg({'Quantity Sold (kilo)': 'sum'}).reset_index()
        df_grouped.columns = ['Producto', 'Fecha', 'Kilos']

        # --- 2. Seleccionar producto ---

        df_prod = df_grouped[df_grouped['Producto'] == producto_objetivo].copy()

        if df_prod.empty:
            raise ValueError(f"No se encontraron datos para el producto: '{producto_objetivo}'")

        # Rellenar fechas e interpolar
        fecha_inicio = df_prod['Fecha'].min()
        fecha_fin = df_prod['Fecha'].max()
        fechas_completas = pd.DataFrame({'Fecha': pd.date_range(fecha_inicio, fecha_fin, freq='D')})
        df_prod_full = fechas_completas.merge(df_prod, on='Fecha', how='left')
        df_prod_full['Producto'] = producto_objetivo
        df_prod_full['Kilos'] = df_prod_full['Kilos'].interpolate(method='linear', limit_direction='both')

        # --- 3. Añadir variables temporales ---
        df_prod_full['dayofweek'] = df_prod_full['Fecha'].dt.dayofweek
        df_prod_full['month'] = df_prod_full['Fecha'].dt.month
        df_prod_full['is_weekend'] = (df_prod_full['dayofweek'] >= 5).astype(int)

        # --- 4. Preparar datos para LSTM ---
        window_size = 7
        forecasting_horizon = 1
        test_ratio = 0.25

        features = ['Kilos', 'dayofweek', 'month', 'is_weekend']
        data = df_prod_full[features].values
        fechas = df_prod_full['Fecha'].values

        split_index = int(len(data) * (1 - test_ratio))
        data_train = data[:split_index]
        data_test = data[split_index - window_size:]
        fechas_test = fechas[split_index - window_size:]

        X_train, y_train, X_test, y_test, fechas_y_test = [], [], [], [], []

        # Entrenamiento
        for i in range(len(data_train) - window_size - forecasting_horizon + 1):
            X_train.append(data_train[i:i+window_size])
            y_train.append(data_train[i+window_size:i+window_size+forecasting_horizon, 0])  # solo Kilos

        # Test
        for i in range(len(data_test) - window_size - forecasting_horizon + 1):
            X_test.append(data_test[i:i+window_size])
            y_test.append(data_test[i+window_size:i+window_size+forecasting_horizon, 0])
            fechas_y_test.append(fechas_test[i+window_size:i+window_size+forecasting_horizon])

        X_train = np.array(X_train)
        X_test = np.array(X_test)
        y_train = np.array(y_train)
        y_test = np.array(y_test)
        fechas_y_test = np.array(fechas_y_test)

        # --- 5. Construir y entrenar el modelo LSTM ---
        model = Sequential()
        model.add(LSTM(64, activation='tanh', input_shape=(window_size, X_train.shape[2])))
        model.add(Dense(forecasting_horizon))
        model.compile(optimizer=Adam(learning_rate=0.001), loss='mse')

        model.fit(X_train, y_train, epochs=20, batch_size=32, validation_split=0.1, verbose=1)

        # --- 6. Predicción y evaluación ---
        y_pred = model.predict(X_test)

        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))


        ultima_ventana = X_test[-1]  # forma: (window_size, n_features)
        ultima_ventana = np.expand_dims(ultima_ventana, axis=0)  # forma: (1, window_size, n_features)
        prediccion_futura = model.predict(ultima_ventana)[0]




        #Convertir datos antes de enviar JSON
        return jsonify({
            "producto": producto_objetivo,
            "mae": float(mae),  # Convertimos a float estándar para evitar errores de JSON
            "rmse": float(rmse),  # Convertimos a float estándar para evitar errores de JSON
            "prediccion_futura": float(prediccion_futura)  # Convertimos la predicción futura
        })

    except Exception as e:
        print("ERROR en prediccion_stock:", e)
        return jsonify({"error": str(e)}), 500
    

