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
    if (phone.trim() === "") return true;
    let re = /^\+\d{3}\.\d{8}$/;
    return re.test(phone) 
}
const validatorChanel = (chanel) => {
    return chanel.trim().length > 3 && chanel.trim().length <= 50;
}
/* Validación Mascota */
const validatorInt = (int) => int && Number.isInteger(Number(int))
const validadorPhotos = (files) => {
    if (!files) return false;
    let lengthValid = 1 <= files.length && files.length <= 5;
    return lengthValid;
  };
const validatorDate = (date, min) => {
    return date >= min
}

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
    let date = aviso["deliver"].value;
    let minDate = aviso["deliver"].min;
    let photos = aviso["photo"].value;
    

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
        setInvalidInput("Número celular")
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
    if (!validatorDate(date, minDate)) {
        setInvalidInput("Fecah de entrega")
    }
    for (photo of photos) {
        if (!validadorPhotos(photos)) {
            setInvalidInput("Fotos")
    }}

    let validationBox = document.getElementById("msg-box");
    let validationList = document.getElementById("msg-list");
    let validationMsg = document.getElementById("msg-val");

    let confirmBtn = document.getElementById("confirm-btn");
    let unconfirmBtn = document.getElementById("not-confirm-btn");
    unconfirmBtn.style.backgroundColor = "#f44336";

    const confirmAction = () => {
        validationMsg.innerText  = "Hemos recibido la información de adopción, muchas gracias y suerte!"
        document.getElementById("home-btn").hidden = false;
        confirmBtn.hidden = true;
        unconfirmBtn.hidden = true;
    }

    const unconfirmAction = () => {
        validationList.innerText = "";
        aviso.hidden = false;
        confirmBtn.hidden = true;
        unconfirmBtn.hidden = true;
        validationBox.style.backgroundColor = "#ffdddd";
        validationBox.style.borderLeftColor = "#f44336";
        validationMsg.innerText  = "Secciones inválidas";
        validationBox.hidden = true;
        document.getElementById("add-aviso").hidden = false;
    }

    confirmBtn.addEventListener("click", confirmAction)
    unconfirmBtn.addEventListener("click", unconfirmAction)

    if (isValid) {
        //el formulario es válido
        aviso.hidden = true;
        validationBox.hidden = false;
        document.getElementById("add-aviso").hidden = true;
        validationList.innerText = "";
        validationBox.style.backgroundColor = "#ddffdd";
        validationBox.style.borderLeftColor = "#4CAF50";
        validationMsg.innerText  = "¿Está seguro que desea agregar este aviso de adopción?";
        confirmBtn.hidden = false;
        unconfirmBtn.hidden = false;
    }else{
        validationBox.hidden = false;
        validationList.innerText = "";
        //el formulario es inválido
        for (input of invalidInputs) {
            let listElement = document.createElement("li");
            listElement.innerText = input;
            validationList.append(listElement);
        }
    }   
}

let chanel = document.getElementById("chanel");
chanel.addEventListener("change", () => {
    if (chanel.value == "Elige una opción") {
        document.getElementById("chanel-input-div").style.display = "none"
    } else {
        document.getElementById("chanel-input-div").style.display = "flex"
    }
})


//botones
let addBtn = document.getElementById("add-aviso");
addBtn.addEventListener("click", validarAviso);

// script para las fotos
const container = document.getElementById("fotos-container");
const addPhotoBtn = document.getElementById("agregar-foto");

let contador = 1;
const maxFotos = 5;

addPhotoBtn.addEventListener("click", () => {
    if (contador < maxFotos) {
      contador++;

      const label = document.createElement("label");
      label.setAttribute("for", `foto-${contador}`);
      label.textContent = `Foto ${contador}:`;

      const input = document.createElement("input");
      input.type = "file";
      input.id = `foto-${contador}`;
      input.name = "fotos[]";
      input.accept = "image/*";

      container.appendChild(document.createElement("br"));
      container.appendChild(label);
      container.appendChild(input);
    } else {
      alert("No puedes agregar más de 5 fotos.");
    }
  });