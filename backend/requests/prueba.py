import json
from bokeh.plotting import figure
from flask import jsonify
import pandas as pd


def prueba():
    dataset = pd.read_csv('\data\dataset_formateado.csv')
    dataset.head()
    x_axis = dataset[[]]


    return x_axis


prueba()
