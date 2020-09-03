//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    const loginForm = document.getElementById('loginForm');

    loginForm.onsubmit = function(e) {
        e.preventDefault();
        let userEmail = document.getElementById('inputEmail').value;
        localStorage.setItem('email', userEmail);
        window.location.href = '/principal.html';
    };
});