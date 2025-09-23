import pymysql
import json

DB_NAME = "tarea2"
DB_USERNAME = "cc5002"
DB_PASSWORD = "programacionweb"
DB_HOST = "localhost"
DB_PORT = 3306
DB_CHARSET = "utf8"

with open('database/querys.json', 'r') as querys:
	QUERY_DICT = json.load(querys)

# -- conn ---

def get_conn():
	conn = pymysql.connect(
		db=DB_NAME,
		user=DB_USERNAME,
		passwd=DB_PASSWORD,
		host=DB_HOST,
		port=DB_PORT,
		charset=DB_CHARSET
	)
	return conn

# -- querys --
def get_adoptions():
	conn = get_conn()
	cursor = conn.cursor()#foto
	sql = "SELECT * FROM aviso_adopcion"
	cursor.execute(sql)
	avisos = cursor.fetchall()
	return avisos

def get_5_adoptions():
	conn = get_conn()
	cursor = conn.cursor()#foto
	sql = "SELECT * FROM aviso_adopcion ORDER BY fecha_ingreso DESC LIMIT 5;"
	cursor.execute(sql)
	avisos = cursor.fetchall()
	return avisos

def getComunaId(comuna):
  conn = get_conn()
  sql = "SELECT id FROM comuna WHERE nombre=%s"
  cursor = conn.cursor()
  cursor.execute(sql, (comuna))
  comunaId = cursor.fetchone()
  return comunaId[0] 

def getComuna(comunaId):
  conn = get_conn()
  sql = "SELECT nombre FROM comuna WHERE id=%s;"
  cursor = conn.cursor()
  cursor.execute(sql, (comunaId))
  comunaId = cursor.fetchone()
  return comunaId[0] 

def getAvisoId(fechaI, comuna, sector, nombre, mail, phone, type, cuantity, age, medida, fechaE, desc):
	conn = get_conn()
	cursor = conn.cursor()
	sql = "SELECT id FROM aviso_adopcion WHERE fecha_ingreso=%s AND comuna_id=%s AND sector=%s AND nombre=%s AND email=%s AND celular=%s AND tipo=%s AND cantidad=%s AND edad=%s AND unidad_medida=%s AND fecha_entrega=%s AND descripcion=%s;"
	comuna_id = getComunaId(comuna)
	cursor.execute(sql, (fechaI, comuna_id, sector, nombre, mail, phone, type, cuantity, age, medida, fechaE, desc))
	id = cursor.fetchone()
	return id

def getPhoto(aviso_id):
	conn = get_conn()
	cursor = conn.cursor()
	sql = "SELECT ruta_archivo, nombre_archivo FROM foto WHERE aviso_id=%s"
	cursor.execute(sql, (aviso_id))
	_, name  = cursor.fetchone()
	return name

def getAviso(aviso_id):
	conn = get_conn()
	cursor = conn.cursor()
	sql = "SELECT * FROM aviso_adopcion WHERE id=%s"
	cursor.execute(sql, (aviso_id))
	aviso  = cursor.fetchall()
	return aviso[0]

# -- db-related functions --

def add_adoption(fechaI, comuna, sector, nombre, mail, phone, type, cuantity, age, medida, fechaE, desc):
	conn = get_conn()
	cursor = conn.cursor()
	sql = "INSERT INTO aviso_adopcion (fecha_ingreso, comuna_id, sector, nombre, email, celular, tipo, cantidad, edad, unidad_medida, fecha_entrega, descripcion) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);"
	comuna_id = getComunaId(comuna)
	cursor.execute(sql, (fechaI, comuna_id, sector, nombre, mail, phone, type, cuantity, age, medida, fechaE, desc))
	conn.commit()
	# mensaje verificación?

def addContact(chanel, chanel_input, id):
	conn = get_conn()
	cursor = conn.cursor()
	sql = "INSERT INTO contactar_por (nombre, identificador) values (%s, %s)"
	cursor.execute(sql, (chanel, chanel_input))
	conn.commit()

def addPhoto(path, name, aviso_id):
	conn = get_conn()
	cursor = conn.cursor()
	sql = "INSERT INTO foto (ruta_archivo, nombre_archivo, aviso_id) values (%s, %s, %s)"
	cursor.execute(sql, (path, name, aviso_id))
	conn.commit()