/* Validación Lugar */

const validadorSelect = (select) => select;

/* Validación contacto */

const validatorName = (name) => {
    return name && name.trim().length > 2 && name.trim().length <= 200; 
}

const validatorMail = (mail) => {
    let re = /^[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    return mail && re.test(mail) && mail.trim().length <= 100;
}

/* Validación Mascota */

const validatorInt = (int) => {
    
}

const validadorPhotos = (files) => {
    if (!files) return false;
    let lengthValid = 1 <= files.length && files.length <= 5;
    return lengthValid;
  };



