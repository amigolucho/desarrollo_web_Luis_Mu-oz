import re
from datetime import datetime

# -------------------------------
# Validaciones Lugar
# -------------------------------
def validador_select(valor):
    "Valida que un select tenga un valor (no vacío)"
    return bool(valor and valor.strip())

def validador_sector(sector):
    "Sector no puede superar 100 caracteres"
    return sector is not None and len(sector.strip()) <= 100


# -------------------------------
# Validaciones Contacto
# -------------------------------
def validator_name(name):
    "Nombre obligatorio: entre 3 y 200 caracteres"
    return bool(name and 2 < len(name.strip()) <= 200)

def validator_mail(mail):
    "Email válido (regex + largo <= 100)"
    if not mail:
        return False
    regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return re.match(regex, mail) is not None and len(mail.strip()) <= 100

def validator_phone(phone):
    """Teléfono opcional. Si se envía, debe tener formato +NNN.NNNNNNNN"""
    if not phone or phone.strip() == "":
        return True
    regex = r"^\+\d{3}\.\d{8}$"
    return re.match(regex, phone) is not None

def validator_chanel_optional(chanel):
    """Canal opcional: si existe, debe tener entre 4 y 50 caracteres."""
    if not chanel or chanel.strip() == "":
        return True
    return 3 < len(chanel.strip()) <= 50

def validator_chanel_required(chanel):
    """Canal obligatorio: entre 4 y 50 caracteres."""
    return bool(chanel and 3 < len(chanel.strip()) <= 50)


# -------------------------------
# Validaciones Mascota
# -------------------------------
def validator_int(value):
    """Valida que el valor sea un entero."""
    try:
        int(value)
        return True
    except (TypeError, ValueError):
        return False

def validador_photos(files):
    """
    Valida que haya al menos una foto y que la extensión sea válida.
    Espera una lista de nombres de archivo (strings).
    """
    if not files or len(files) == 0:
        return False
    
    extensiones_permitidas = {"jpg", "jpeg", "png"}
    for file in files:
        if "." not in file:
            return False
        extension = file.rsplit(".", 1)[1].lower()
        if extension not in extensiones_permitidas:
            return False
    return True


def validator_date(date_str, min_str):
    """
    Valida que la fecha de entrega sea >= fecha mínima.
    Formato esperado: YYYY-MM-DDTHH:MM (input datetime-local).
    """
    try:
        fecha = datetime.strptime(date_str, "%Y-%m-%dT%H:%M")
        min_fecha = datetime.strptime(min_str, "%Y-%m-%dT%H:%M")
        return fecha >= min_fecha
    except Exception:
        return False
    
def validar_aviso(form):
    errores = []

    # --- Validaciones Lugar ---
    if not validador_select(form.get("comuna")):
        errores.append("Comuna")
    if not validador_sector(form.get("sector", "")):
        errores.append("Sector")

    # --- Validaciones Contacto ---
    if not validator_name(form.get("name", "")):
        errores.append("Nombre Contacto")
    if not validator_mail(form.get("email", "")):
        errores.append("Email")
    if not validator_phone(form.get("phone", "")):
        errores.append("Número celular")

    # --- Validaciones Mascota ---
    if not validador_select(form.get("type")):
        errores.append("Tipo")
    if not validator_int(int(form.get("cantidad"))):
        errores.append("Cantidad")
    if not validator_int(form.get("age")):
        errores.append("Edad")
    if not validador_select(form.get("medida")):
        errores.append("Unidad de medida edad")

    

    desc = form.get("desc", "")
    if desc and len(desc) > 500:
        errores.append("Descripción demasiado larga")

    return errores

