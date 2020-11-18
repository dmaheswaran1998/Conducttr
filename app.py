from flask import Flask, render_template, redirect, jsonify
from flask_pymongo import PyMongo
import cleaning
import clean_filter

# Create an instance of Flask
app = Flask(__name__)


# Use flask_pymongo to set up mongo connection
# app.config["MONGO_URI"] = "mongodb://localhost:27017/mars_app"
# mongo = PyMongo(app)

# Route to render index.html template using data from Mongo
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/filter")
def filter():
  
    return render_template("filter.html")


@app.route("/player_data")
def player_data():
  
    return jsonify(cleaning.clean_data())

@app.route("/filter_form")
def filter_form():
  
    return jsonify(clean_filter.filter_page())



if __name__ == "__main__":
    app.run(debug=True)
