/* Validación Lugar */

const validadorSelect = (select) => select;

const validarLugar = (lugar) => {
    let region = lugar["region"].value;
    let comuna = lugar["comuna"].value;
    let sector = lugar["sector"].value;

    return validadorSelect(region) && validadorSelect(comuna) && validadorSelect(sector); //hacer que devuelva un bool?
}

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

const validarContacto = (contacto) => {
    let name = contacto["name"].value;
    let email = contacto["email"].value;
    let phone = contacto["phone"].value;
    let chanel = contacto["chanel"].value;

    return  validatorName(name) && validatorMail(email) && validatorPhone(phone) && validatorChanel(chanel)
}

/* Validación Mascota */

const validatorInt = (int) => {
    
}

const validadorPhotos = (files) => {
    if (!files) return false;
    let lengthValid = 1 <= files.length && files.length <= 5;
    return lengthValid;
  };

const validarAviso = () => {
    let aviso = document.getElementById("aviso"); // formulatio
    let validLugar = validarLugar(aviso);
    let validContacto = validarContacto(aviso)



    if (!validContacto) {
        console.log(false);
    }else {
        console.log(true);
    }

    let a = document.getElementById("a");
    a.innerHTML = "aaaa";
}

let addBtn = document.getElementById("add-aviso");
addBtn.addEventListener("click", validarAviso);
