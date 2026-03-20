from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split

app = Flask(__name__)
CORS(app)  # allows React to talk to Flask

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="mirra01",
        database="stockdb"
    )


@app.route("/stocks", methods=["GET"])
def get_stocks():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT * FROM stocks LIMIT 100")
    result = cursor.fetchall()
    db.close()
    return jsonify(result)


@app.route("/query", methods=["POST"])
def run_query():
    db = get_db()
    try:
        data = request.get_json()
        sql = data.get("query", "")

        # safety: only allow SELECT
        if not sql.strip().upper().startswith("SELECT"):
            return jsonify({"error": "Only SELECT queries are allowed"}), 400

        cursor = db.cursor(dictionary=True)
        cursor.execute(sql)
        result = cursor.fetchall()
        db.close()
        return jsonify({"data": result})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/predict", methods=["GET"])
def predict():
    db = get_db()
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT date, open, high, low, close, volume FROM stocks ORDER BY date")
    data = cursor.fetchall()
    db.close()

    df = pd.DataFrame(data)
    df["date"] = pd.to_datetime(df["date"])

    X = df[["open", "high", "low", "volume"]]
    y = df["close"]

    X_train, X_test, y_train, y_test, train_dates, test_dates = train_test_split(
        X, y, df["date"], test_size=0.2, shuffle=False
    )

    model = LinearRegression()
    model.fit(X_train, y_train)
    predictions = model.predict(X_test)

    return jsonify({
        "dates": test_dates.dt.strftime("%Y-%m-%d").tolist(),
        "actual": y_test.tolist(),
        "predicted": predictions.tolist(),
        "info": {
            "train_start": str(train_dates.iloc[0].date()),
            "train_end": str(train_dates.iloc[-1].date()),
            "test_start": str(test_dates.iloc[0].date()),
            "test_end": str(test_dates.iloc[-1].date())
        }
    })


if __name__ == "__main__":
    app.run(debug=True)