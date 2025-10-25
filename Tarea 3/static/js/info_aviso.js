function openModal(img) {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("expandedImg");
    
    modal.style.display = "block";
    modalImg.src = img.src;
}

function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById("imageModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

//obtener valores del html
let formComentario = document.getElementById("form-comentario");
let nombreInput = document.getElementById("nombre");
let comentarioInput = document.getElementById("comentario");
let btnAgregar = document.getElementById("btn-agregar");
let mensajeDiv = document.getElementById("mensaje");
let comentariosContainer = document.getElementById("comentarios-container");
let avisoId = document.getElementById("aviso-id").value;

//validamos usuario y comentario
let validarNombre = () => {
  let nombre = nombreInput.value.trim();
  let errorNombre = document.getElementById("error-nombre");
  
  if (nombre.length === 0) {
    errorNombre.innerText = "El nombre es obligatorio";
    nombreInput.classList.add("invalid");
    return false;
  } else if (nombre.length < 3) {
    errorNombre.innerText = "El nombre debe tener al menos 3 caracteres";
    nombreInput.classList.add("invalid");
    return false;
  } else if (nombre.length > 80) {
    errorNombre.innerText = "El nombre no puede exceder 80 caracteres";
    nombreInput.classList.add("invalid");
    return false;
  } else {
    errorNombre.innerText = "";
    nombreInput.classList.remove("invalid");
    return true;
  }
};

let validarComentario = () => {
  let comentario = comentarioInput.value.trim();
  let errorComentario = document.getElementById("error-comentario");
  
  if (comentario.length === 0) {
    errorComentario.innerText = "El comentario es obligatorio";
    comentarioInput.classList.add("invalid");
    return false;
  } else if (comentario.length < 5) {
    errorComentario.innerText = "El comentario debe tener al menos 5 caracteres";
    comentarioInput.classList.add("invalid");
    return false;
  } else {
    errorComentario.innerText = "";
    comentarioInput.classList.remove("invalid");
    return true;
  }
};

let mostrarMensaje = (texto, tipo) => {
  mensajeDiv.innerText = texto;
  mensajeDiv.className = "mensaje " + tipo;
  mensajeDiv.style.display = "block";
  
  setTimeout(() => {
    mensajeDiv.style.display = "none";
  }, 5000);
};

let formatearFecha = (fechaStr) => {
  let fecha = new Date(fechaStr);
  let dia = String(fecha.getDate()).padStart(2, "0");
  let mes = String(fecha.getMonth() + 1).padStart(2, "0");
  let anio = fecha.getFullYear();
  let horas = String(fecha.getHours()).padStart(2, "0");
  let minutos = String(fecha.getMinutes()).padStart(2, "0");
  
  return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
};

let cargarComentarios = () => {
    console.log("ide"+avisoId)
  fetch(`${window.origin}/obtener-comentarios/${avisoId}`, {
    method: "GET"
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error("Error al cargar comentarios");
    }
    return response.json();
  })
  .then((comentarios) => {
    console.log("ide"+avisoId)
    mostrarComentarios(comentarios);
  })
  .catch((error) => {
    console.error("Error:", error);
    comentariosContainer.innerHTML = '<p class="sin-comentarios">Error al cargar los comentarios</p>';
  });
};

let mostrarComentarios = (comentarios) => {
  // Limpiar contenedor
  while (comentariosContainer.firstChild) {
    comentariosContainer.removeChild(comentariosContainer.firstChild);
  }
  
  // Si no hay comentarios
  if (comentarios.length === 0) {
    let sinComentarios = document.createElement("p");
    sinComentarios.className = "sin-comentarios";
    sinComentarios.innerText = "No hay comentarios todavía. ¡Sé el primero en comentar!";
    comentariosContainer.appendChild(sinComentarios);
    return;
  }
  
  // Crear elementos para cada comentario
  for (let comentario of comentarios) {
    console.log(comentario)
    let divComentario = document.createElement("div");
    divComentario.className = "comentario";
    
    // Header (nombre y fecha)
    let divHeader = document.createElement("div");
    divHeader.className = "comentario-header";
    
    let spanAutor = document.createElement("span");
    spanAutor.className = "comentario-autor";
    spanAutor.innerText = comentario.nombre;
    
    let spanFecha = document.createElement("span");
    spanFecha.className = "comentario-fecha";
    spanFecha.innerText = formatearFecha(comentario.fecha);
    
    divHeader.appendChild(spanAutor);
    divHeader.appendChild(spanFecha);
    
    // Texto del comentario
    let divTexto = document.createElement("div");
    divTexto.className = "comentario-texto";
    divTexto.innerText = comentario.texto;
    
    // Agregar todo al comentario
    divComentario.appendChild(divHeader);
    divComentario.appendChild(divTexto);
    
    // Agregar comentario al contenedor
    comentariosContainer.appendChild(divComentario);
  }
};

let agregarComentario = (event) => {
  event.preventDefault();
  
  // Validar campos
  let nombreValido = validarNombre();
  let comentarioValido = validarComentario();
  
  if (!nombreValido || !comentarioValido) {
    mostrarMensaje("Por favor corrige los errores en el formulario", "error-msg");
    return;
  }
  
  // Deshabilitar botón
  btnAgregar.disabled = true;
  btnAgregar.innerText = "Enviando...";
  
  // Preparar datos
  let datos = {
    aviso_id: avisoId,
    nombre: nombreInput.value.trim(),
    comentario: comentarioInput.value.trim()
  };
  
  // Enviar con fetch
  fetch(`${window.origin}/agregar-comentario`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datos)
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error("Error al agregar comentario");
    }
    return response.json();
  })
  .then((resultado) => {
    if (resultado.exito) {
      mostrarMensaje("Comentario agregado exitosamente", "exito");
      
      // Limpiar formulario
      formComentario.reset();
      nombreInput.classList.remove("invalid");
      comentarioInput.classList.remove("invalid");
      
      // Recargar comentarios
      cargarComentarios();
    } else {
      mostrarMensaje(resultado.mensaje || "Error al agregar el comentario", "error-msg");
    }
  })
  .catch((error) => {
    console.error("Error:", error);
    mostrarMensaje("Error al conectar con el servidor", "error-msg");
  })
  .finally(() => {
    btnAgregar.disabled = false;
    btnAgregar.innerText = "Agregar comentario";
  });
};

// Event listeners
nombreInput.addEventListener("input", validarNombre);
comentarioInput.addEventListener("input", validarComentario);
formComentario.addEventListener("submit", agregarComentario);

cargarComentarios();