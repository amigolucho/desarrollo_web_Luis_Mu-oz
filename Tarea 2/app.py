from flask import Flask, request, render_template, redirect, url_for, session
from utils.validations import validate_login_user, validate_register_user, validate_confession
from database import db
from werkzeug.utils import secure_filename
import hashlib
import filetype
import os

UPLOAD_FOLDER = 'static/uploads'

app = Flask(__name__)
app.secret_key = "secret_key"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route("/", methods=["GET"])
def index():
    avisos = []
    for aviso in db.get_5_adoptions():
        _, fechaI, comunaId, sector, _, _, _, type, cuantity, age, medida, _, _ = aviso
        
        #Pasar de la info del db a lo que se muestra
        comuna = db.getComuna(comunaId)
        if sector == 'None': sector = "No especificado"
        if medida == 'a':
            medida = 'años'
        else:
            medida = 'meses'
        avisos.append({
            "fecha": fechaI,
            "comuna": comuna,
            "sector": sector,
            "cantidad": cuantity,
            "tipo": type,
            "edad": age,
            "medida": medida
        })
    
    return render_template("tables/index.html", avisos=avisos)

@app.route("/agregar-aviso", methods=["GET", "POST"])
#poner metodo post para postear el formulario
def agregar_aviso():
    if request.method == "GET":
        return render_template("avisos/agregar_aviso.html")
    
    fechaI = "2024-09-10 09:24:28"
    comuna = request.form.get("comuna")
    sector = request.form.get("sector")
    name = request.form.get("name")
    email = request.form.get("email")
    phone = request.form.get("phone")
    type = request.form.get("type")
    cuantity = request.form.get("cantidad")
    age = request.form.get("age")
    medida = request.form.get("medida")
    fechaE = request.form.get("deliver")
    desc = request.form.get("description")
    #-------------------------------------------
    chanel = request.form.get("chanel")
    if chanel != None: 
        chanel_input = request.form.get("description")
        db.addContact(chanel, chanel_input, 1)
    #-------------------------------------------
    photos = request.form.get("fotos-container")
    # validar aqui?

    db.add_adoption(fechaI, comuna, sector, name, email, phone, type, cuantity, age, medida, fechaE, desc)
    render_template("tables/index.html")

@app.route("/avisos", methods=["GET"])
def avisos():
    avisos = []
    for aviso in db.get_adoptions():
        _, fechaI, comunaId, sector, _, _, _, type, cuantity, age, medida, _, _ = aviso
        
        #Pasar de la info del db a lo que se muestra
        comuna = db.getComuna(comunaId)
        if sector == 'None': sector = "No especificado"
        if medida == 'a':
            medida = 'años'
        else:
            medida = 'meses'
        avisos.append({
            "fecha": fechaI,
            "comuna": comuna,
            "sector": sector,
            "cantidad": cuantity,
            "tipo": type,
            "edad": age,
            "medida": medida
        })
    

    return render_template("avisos/lista_avisos.html", avisos=avisos)

@app.route("/estadisticas", methods=["GET"])
def estadisticas():
    return render_template("estadisticas.html")




if __name__ == "__main__":
    app.run(debug=True)
