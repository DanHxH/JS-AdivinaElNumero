// Definición de variables
let numeroAleatorio; // Número aleatorio que el jugador debe adivinar
let intentos; // Número de intentos restantes
let numerosIntentados; // Números que el jugador ha intentado
let juegoTerminado = false; // Variable para controlar si el juego ha terminado

// Función para iniciar la animación de confeti cuando el jugador gana
function startConfetti() {
    confetti({
        particleCount: 100,
        startVelocity: 30,
        spread: 360,
        origin: {
            y: 0.6
        }
    });
}

// Generar un número aleatorio entre 1 y 100
function generarNumeroAleatorio() {
    return Math.floor(Math.random() * 100) + 1;
}

// Inicializar el juego
function iniciarJuego() {
    numeroAleatorio = generarNumeroAleatorio();
    intentos = 5;
    numerosIntentados = [];
    juegoTerminado = false; // Reiniciar el estado del juego
    document.getElementById('message').textContent = '';
    document.getElementById('congratulations').classList.add('hidden');
    document.getElementById('input-container').classList.remove('hidden');
    document.getElementById('indicator').style.backgroundColor = ''; // Reiniciar el indicador
    document.getElementById('guess-input').value = '';
    document.getElementById('guess-input').focus();
}

// Actualizar el indicador visual de proximidad a la respuesta correcta
function actualizarIndicador(proximidad) {
    const indicador = document.getElementById('indicator');
    indicador.style.backgroundColor = proximidad === 'cerca' ? 'yellow' : 
                                      proximidad === 'regular' ? 'orange' : 'red';
}

// Función principal del juego
function jugar() {
    if (juegoTerminado) return; // Si el juego ha terminado, no realizar más acciones

    const conjetura = parseInt(document.getElementById('guess-input').value);

    // Verificar si la conjetura es un número válido entre 1 y 100
    if (isNaN(conjetura) || conjetura < 1 || conjetura > 100) {
        document.getElementById('message').textContent = "Por favor, ingresa un número válido entre 1 y 100.";
        return;
    }

    // Verificar si la conjetura ya ha sido intentada antes
    if (numerosIntentados.includes(conjetura)) {
        document.getElementById('message').textContent = "Ya has intentado este número. Por favor, intenta con otro.";
        return;
    }

    numerosIntentados.push(conjetura);

    // Verificar si la conjetura es correcta
    if (conjetura === numeroAleatorio) {
        document.getElementById('congratulations-message').textContent = "¡Felicidades, adivinaste el número!";
        document.getElementById('congratulations-message').classList.add('success');
        document.getElementById('congratulations').classList.remove('hidden');
        document.getElementById('input-container').classList.add('hidden');
        document.getElementById('indicator').style.backgroundColor = 'green'; // Cambiar indicador a verde
        startConfetti(); // Iniciar la animación de confeti
        juegoTerminado = true; // Establecer el juego como terminado
        return;
    } else {
        // Determinar la proximidad de la conjetura al número correcto
        let proximidad = '';
        const diferencia = Math.abs(conjetura - numeroAleatorio);
        if (diferencia <= 10) {
            proximidad = 'cerca';
        } else if (diferencia <= 20) {
            proximidad = 'regular';
        } else {
            proximidad = 'lejos';
        }

        actualizarIndicador(proximidad); // Actualizar el indicador visual

        // Mostrar mensaje de error y detalles de la conjetura
        let mensaje = `<span class="fail">Fallaste.</span><br>El número ${conjetura} no es correcto.`;
        if (conjetura < numeroAleatorio) {
            mensaje += "<br>Te quedaste corto.";
        } else {
            mensaje += "<br>Te pasaste.";
        }
        mensaje += `<br>Números probados: ${numerosIntentados.join(", ")}.`;
        document.getElementById('message').innerHTML = mensaje;
    }

    intentos--;
    // Verificar si el jugador ha agotado todos los intentos
    if (intentos === 0) {
        juegoTerminado = true; // Establecer el juego como terminado
        document.getElementById('message').textContent = '';
        document.getElementById('congratulations-message').textContent = `Lo siento, has agotado todos tus intentos. El número correcto era ${numeroAleatorio}.`;
        document.getElementById('congratulations-message').classList.add('fail');
        document.getElementById('congratulations').classList.remove('hidden');
        document.getElementById('input-container').classList.add('hidden');
    }

    // Limpiar el input
    document.getElementById('guess-input').value = '';
}

// Event listeners para el botón de adivinanza, input y reinicio del juego
document.getElementById('guess-button').addEventListener('click', jugar);
document.getElementById('guess-input').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        jugar();
    }
});
document.getElementById('restart-button').addEventListener('click', iniciarJuego);

// Iniciar el juego cuando la ventana se carga
window.addEventListener('load', iniciarJuego);

// Enfocar el input cuando la ventana se carga
window.addEventListener('load', function() {
    document.getElementById('guess-input').focus();
});