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
    medida = request.form.get("medida")[0]
    fechaE = request.form.get("deliver")
    desc = request.form.get("description")
    #-------------------------------------------
    chanel = request.form.get("chanel")
    #if chanel != None: 
     #   chanel_input = request.form.get("description")
      #  db.addContact(chanel, chanel_input, 1)
    #-------------------------------------------
    i = 1
    while i<=5:
        photo = request.files.get("Foto " + str(i))
        if photo == None:
            break
        print(photo.filename + "ola")

        i+=1
        #photo.save(os.path.join(app.config["UPLOAD_FOLDER"],photo.filename))
        db.addPhoto(app.config["UPLOAD_FOLDER"], photo.filename,1)


    #db.add_adoption(fechaI, comuna, sector, name, email, phone, type, cuantity, age, medida, fechaE, desc)
    return redirect(url_for("index"))


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