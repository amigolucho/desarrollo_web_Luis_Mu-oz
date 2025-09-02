/* Validación Lugar */
const validadorSelect = (select) => select;

const validadorSector = (sector) => {
    return sector.trim().length <= 100;
}


/* Validación contacto */
const validatorName = (name) => {
    return name && name.trim().length > 2 && name.trim().length <= 200; 
}
const validatorMail = (mail) => {
    let re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return mail && re.test(mail) && mail.trim().length <= 100;
}
const validatorPhone = (phone) => {
    let re = /^\+\d{3}\.\d{8}$/;
    return re.test(phone) 
}
const validatorChanel = (chanel) => {
    return chanel.trim().length > 3 && chanel.trim().length <= 50;
}
/* Validación Mascota */
const validatorInt = (int) => Number.isInteger(Number(int))
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
    let chanel = aviso["chanel-input"].value;
    let type = aviso["type"].value;
    let cantidad = aviso["cantidad"].value;
    let age = aviso["age"].value;
    let medida = aviso["medida"].value;
    let deliver = aviso["deliver"].value;
    let photo = aviso["photo"].value;
    

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
    if (!validadorSector(sector)) {
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
    if (!validadorSelect(type)) {
        setInvalidInput("Tipo")
    }
    if (!validatorInt(cantidad)) {
        setInvalidInput("Cantidad")
    }
    if (!validatorInt(age)) {
        setInvalidInput("Edad")
    }
    if (!validadorSelect(medida)) {
        setInvalidInput("Unidad de medida edad")
    }
    if (!validadorPhotos(photo)) {
        setInvalidInput("Fotos")
    }
    

    console.log(phone);
    console.log(invalidInputs);
}

let addBtn = document.getElementById("add-aviso");
addBtn.addEventListener("click", validarAviso);
