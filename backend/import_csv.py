import pandas as pd
import mysql.connector

# load dataset
df = pd.read_csv("StockPriceDataset.csv")

# connect mysql
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="mirra01",
    database="stockdb"
)

cursor = conn.cursor()

for _, row in df.iterrows():
    sql = """
    INSERT INTO stocks
    (date, open, high, low, close, adj_close, volume, ticker)
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
    """

    cursor.execute(sql, (
        row['Date'],
        row['Open'],
        row['High'],
        row['Low'],
        row['Close'],
        row['Adj Close'],
        row['Volume'],
        row['Ticker']
    ))

conn.commit()

print("Dataset imported successfully")