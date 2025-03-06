from flask import jsonify,Response
import pandas as pd
import numpy as np
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error

def predecir_stock(params):
    
    try:
        intervalo = params.get('intervalo', 'Diariamente')
        producto = params.get('producto')
        
        #Cargar dataset con manejo de errores
        try:
            df = pd.read_csv('data/dataset_formateado.csv')
        except FileNotFoundError:
            return jsonify({"error": "Archivo dataset_formateado.csv no encontrado"}), 500

        df = df[df['Sale or Return'] == 'sale']
        
        #Filtrar por producto
        if producto not in df['Item Name'].unique():
            return jsonify({"error": f"Producto '{producto}' no encontrado en el dataset"}), 400
        
        df = df[df['Item Name'] == producto].reset_index(drop=True)

        #Procesar fechas
        df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
        df['Time'] = pd.to_datetime(df['Time'], format='%H:%M:%S', errors='coerce')  # Corrige el Warning


        if intervalo == 'Semanalmente':
            df_grouped = df.resample('W', on='Date').agg({
                "Quantity Sold (kilo)": "sum",  
                "Unit Selling Price (EUR/kg)": "mean",
            }).reset_index()
        elif intervalo == 'Mensualmente':
            df['Date'] = df['Date'].dt.strftime('%Y-%m')
            df_grouped = df.groupby(["Date"]).agg(
            {"Quantity Sold (kilo)": "sum", "Unit Selling Price (EUR/kg)": "mean"}
        )
        elif intervalo == 'Diariamente':
            df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')
            df_grouped = df.groupby(["Date"]).agg(
            {"Quantity Sold (kilo)": "sum", "Unit Selling Price (EUR/kg)": "mean"}
            )

        #Agrupar datos
        df.set_index("Date", inplace=True)
        

        #Validar datos antes de entrenar
        if df_grouped.empty:
            return jsonify({"error": f"No hay datos suficientes para el producto '{producto}' en el intervalo '{intervalo}'"}), 400

        #Preparación de datos para el modelo
        X = df_grouped[["Unit Selling Price (EUR/kg)"]]
        y = df_grouped["Quantity Sold (kilo)"]

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.13, random_state=42)

        #Entrenamiento del modelo XGBoost
        modelo = XGBRegressor(n_estimators=50, learning_rate=0.05, max_depth=6, subsample=0.8, colsample_bytree=0.8)
        modelo.fit(X_train, y_train)

        #Evaluación del modelo
        preds = modelo.predict(X_test)

        #Mean Absolute Error
        mae = mean_absolute_error(y_test, preds)

        #Root Mean Squared Error
        rmse = np.sqrt(mean_squared_error(y_test, preds))

        #Predicción futura (simulación)
        ultima_fila = X.iloc[-1:].copy()
        prediccion_futura = modelo.predict(ultima_fila)[0]

        #Convertir datos antes de enviar JSON
        return jsonify({
            "producto": producto,
            "intervalo": intervalo,
            "mae": float(mae),  # Convertimos a float estándar para evitar errores de JSON
            "rmse": float(rmse),  # Convertimos a float estándar para evitar errores de JSON
            "prediccion_futura": float(prediccion_futura)  # Convertimos la predicción futura
        })

    except Exception as e:
        return jsonify({"error": +str(e)}), 500
