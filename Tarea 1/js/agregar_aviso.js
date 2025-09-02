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
const validatorPhone = (phone) => {

}
const validatorChanel = (chanel) => {
    return 1 && chanel.trim().length > 3 && chanel.trim().length <= 50;
}
/* Validación Mascota */
const validatorInt = (int) => Number.isInteger(Number(int)) && 0 < Number(int) && Number(int)
const validadorPhotos = (files) => {
    if (!files) return false;
    let lengthValid = 1 <= files.length && files.length <= 5;
    return lengthValid;
  };

const validarAviso = () => {
    let aviso = document.getElementById("aviso"); // formulario

    let region = aviso["region"].value;
    let comuna = aviso["comuna"].value;
    let sector = aviso["sector"].value;
    let name = aviso["name"].value;
    let email = aviso["email"].value;
    let phone = aviso["phone"].value;
    let chanel = aviso["chanel"].value;

    let invalidInputs = [];
    let isValid = true;

    const setInvalidInput = (input) => {
        invalidInputs.push(input);
        isValid &&= false;
    }

    if (!validadorSelect(region)) {
        setInvalidInput("Región")
    }
    if (!validadorSelect(comuna)) {
        setInvalidInput("Comuna")
    }
    if (!validadorSelect(sector)) {
        setInvalidInput("Sector")
    }
    if (!validatorName(name)) {
        setInvalidInput("Nombre Contacto")
    }
    if (!validatorMail(email)) {
        setInvalidInput("Email")
    }
    if (!validatorPhone(phone)) {
        setInvalidInput("Teléfono")
    }
    if (!validatorChanel(chanel)) {
        setInvalidInput("Canal")
    }

    

    if (!isValid) {
        console.log(invalidInputs);
    }else {
        console.log(invalidInputs);
    }
}

let addBtn = document.getElementById("add-aviso");
addBtn.addEventListener("click", validarAviso);
