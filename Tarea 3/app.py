from flask import Flask, request, render_template, redirect, url_for, session, jsonify
from flask_cors import cross_origin
from utils.validations import *
from utils import graficos as gr
from database import db
from werkzeug.utils import secure_filename
import hashlib, filetype, os, random, uuid
from datetime import datetime, timedelta
import time


UPLOAD_FOLDER = 'static/uploads'

app = Flask(__name__)
app.secret_key = "secret_key"
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route("/", methods=["GET"])
def index():
    avisos = []
    for aviso in db.get_5_adoptions():
        aviso_id, fechaI, comunaId, sector, _, _, _, type, cuantity, age, medida, _, _ = aviso
        
        #Pasar de la info del db a lo que se muestra
        comuna = db.getComuna(comunaId)
        photo = db.getPhoto(aviso_id)
        if sector == '': sector = "No especificado"
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
            "medida": medida,
            "photo": photo
        })
    
    return render_template("tables/index.html", avisos=avisos)

@app.route("/agregar-aviso", methods=["GET", "POST"])
def agregar_aviso():
    if request.method == "GET":
        return render_template("avisos/agregar_aviso.html")
    fechaI = datetime.now()
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

    errores = validar_aviso(request.form)
    print(errores)
    if errores == []: # no lo agrega hasta que se valide

        aviso_id = db.add_adoption(fechaI, comuna, sector, name, email, phone, type, cuantity, age, medida, fechaE, desc)
    #-------------------------------------------

        i = 1
        while i<=5:
            photo = request.files.get("Foto " + str(i))
            if photo == None:
                break 

            i+=1
            photo.save(os.path.join(app.config["UPLOAD_FOLDER"],photo.filename))
            db.addPhoto(app.config["UPLOAD_FOLDER"], photo.filename, aviso_id)

        i = 1
        while i<=5:
            chanel_input = request.form.get("Canal "+str(i))
            if chanel_input == "":
                print(chanel_input)
                print(i)
                i+=1
                continue 
            i+=1
            print("guardo canal")
            chanel = request.form.get("chanel")
            db.addContact(chanel, chanel_input, aviso_id)

    return redirect(url_for("index"))

@app.route("/avisos", methods=["GET"])
def avisos():
    avisos = []
    for aviso in db.get_adoptions():
        aviso_id, fechaP, comunaId, sector, contacto, _, _, type, cuantity, age, medida, fechaE, _ = aviso
        
        #Pasar de la info del db a lo que se muestra
        comuna = db.getComuna(comunaId)
        photo = db.getPhoto(aviso_id)
        if sector == '': 
            sector = "No especificado"
        if medida == 'a':
            medida = 'años'
        else:
            medida = 'meses'
        avisos.append({
            "fechaP": fechaP,
            "fechaE": fechaE,
            "comuna": comuna,
            "sector": sector,
            "cantidad": cuantity,
            "tipo": type,
            "edad": age,
            "medida": medida,
            "contacto": contacto,
            "aviso_id": aviso_id,
            "photo": photo
        })
        
    return render_template("avisos/lista_avisos.html", avisos=avisos)

@app.route('/información-aviso/<int:aviso_id>', methods=["GET"])
def info_aviso(aviso_id):

    aviso_id, fechaP, comunaId, sector, contacto, email, phone, type, cuantity, age, medida, fechaE, descripcion = db.getAviso(aviso_id)
    comuna = db.getComuna(comunaId)
    photo = db.getPhoto(aviso_id)
    if sector == '': sector = "No especificado"
    if phone == '': phone = "No especificado"
    if sector == '': sector = "No especificado"
    if descripcion == '': descripcion = "Sin descripción"
    if medida == 'a':
        medida = 'años'
    else:
        medida = 'meses'
    aviso = {
            "id": aviso_id,
            "fechaP": fechaP,
            "fechaE": fechaE,
            "comuna": comuna,
            "sector": sector,
            "cantidad": cuantity,
            "tipo": type,
            "edad": age,
            "medida": medida,
            "contacto": contacto,
            "aviso_id": aviso_id,
            "email": email,
            "phone": phone,
            "photo": photo,
            "descripcion": descripcion
        }

    #get_comments(aviso_id)

    return render_template("avisos/info_aviso.html", aviso=aviso)

@app.route("/estadisticas", methods=["GET"])
def estadisticas():
    return render_template("estadisticas.html")

@app.route("/get-stats-data", methods=["GET"])
@cross_origin(origin="127.0.0.1", supports_credentials=True)
def get_stats_data():
    data= []

    adopciones_semana = {"Lun":0, "Mar":0, "Mié":0, "Jue":0, "Vie":0, "Sáb":0, "Dom":0}
    adopciones_meses = {
    "Enero": {'gato':0, 'perro':0},
    "Febrero": {'gato':0, 'perro':0},
    "Marzo": {'gato':0, 'perro':0},
    "Abril": {'gato':0, 'perro':0},
    "Mayo": {'gato':0, 'perro':0},
    "Junio": {'gato':0, 'perro':0},
    "Julio": {'gato':0, 'perro':0},
    "Agosto": {'gato':0, 'perro':0},
    "Septiembre": {'gato':0, 'perro':0},
    "Octubre": {'gato':0, 'perro':0},
    "Noviembre": {'gato':0, 'perro':0},
    "Diciembre": {'gato':0, 'perro':0}
    }

    dias = list(adopciones_semana.keys())
    meses = list(adopciones_meses.keys())

    tipo = {'gato':0, 'perro':0}

    for aviso in db.get_adoptions():
        aviso_id, fechaP, comunaId, sector, contacto, _, _, type, cuantity, age, medida, fechaE, _ = aviso

        fecha = datetime.strptime(str(fechaP), "%Y-%m-%d %H:%M:%S")
        mes = meses[fecha.month]
        dia = dias[fecha.weekday()]
        adopciones_semana[dia] += 1
        adopciones_meses[mes][type] += 1

        tipo[type] += 1
    data = [adopciones_semana, tipo, adopciones_meses]
    return jsonify(data)

@app.route('/agregar-comentario', methods=['POST'])
@cross_origin()
def agregar_comentario():
    datos = request.get_json()
    nombre = datos.get('nombre', '').strip()
    comentario = datos.get('comentario', '').strip()
    aviso_id = datos.get('aviso_id')
    
    # Validar
    if not nombre or len(nombre) < 3 or len(nombre) > 80:
        return jsonify({'exito': False, 'mensaje': 'Nombre inválido'}), 400
    if not comentario or len(comentario) < 5:
        return jsonify({'exito': False, 'mensaje': 'Comentario inválido'}), 400
    
    # Insertar
    db.add_comment(nombre, comentario, datetime.now(), aviso_id)
    return jsonify({'exito': True, 'mensaje': 'Comentario agregado'})

@app.route('/obtener-comentarios/<int:aviso_id>')
@cross_origin()
def obtener_comentarios(aviso_id):
    comentarios = db.get_comments(aviso_id=aviso_id)
    return jsonify(comentarios)


if __name__ == "__main__":
    app.run(debug=True)