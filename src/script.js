document.addEventListener('DOMContentLoaded', function() {
    const cameraPreview = document.getElementById('camera-preview');
    const cameraStream = document.getElementById('camera-stream');
    const termsCheckbox = document.getElementById('terms');
    const termsInfo = document.getElementById('terms-info');
    const termsTooltip = document.getElementById('terms-tooltip');
    const form = document.getElementById('registration-form');
    const narrationElement = document.getElementById('narration');
    const particlesContainer = document.getElementById('particles');
    const iframeContainer = document.getElementById('iframe-container');
    const codeInput = document.getElementById('codeInput');
    const timerElement = document.getElementById('timer');

    // Función para iniciar la cámara
    function startCamera() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                cameraStream.srcObject = stream;
                cameraPreview.classList.remove('hidden');
                // Guardar el estado de la cámara en localStorage
                localStorage.setItem('cameraStream', true);
                localStorage.setItem('cameraStreamId', stream.id);
                // Detener el stream al salir de la página
                window.addEventListener('beforeunload', function() {
                    stream.getTracks().forEach(track => track.stop());
                    localStorage.removeItem('cameraStream');
                    localStorage.removeItem('cameraStreamId');
                });
            })
            .catch(function(error) {
                console.error('Camera access denied:', error);
            });
    }

    // Comprobar el estado de la cámara
    function checkCameraState() {
        if (localStorage.getItem('cameraStream')) {
            navigator.mediaDevices.enumerateDevices().then(devices => {
                const videoInputDevices = devices.filter(device => device.kind === 'videoinput');
                if (videoInputDevices.length > 0) {
                    startCamera();
                }
            });
        }
    }

    // Validar el formulario antes de enviarlo
    function validateForm() {
        const name = document.getElementById('name').value.trim();
        const age = document.getElementById('age').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const terms = document.getElementById('terms').checked;

        if (!name || !age || !phone || !terms) {
            alert('Por favor, completa todos los campos y acepta los términos y condiciones.');
            return false;
        }

        return true;
    }


    // Mostrar tooltip de términos y condiciones
    if (termsInfo && termsTooltip) {
        termsInfo.addEventListener('mouseover', function() {
            termsTooltip.style.display = 'block';
        });

        termsInfo.addEventListener('mouseout', function() {
            termsTooltip.style.display = 'none';
        });
    }

    if (form) {
        // Evitar que el formulario se envíe al presionar Enter
        form.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                return false;
            }
        });

        form.addEventListener('submit', function(event) {
            event.preventDefault();
            // Validar formulario
            if (validateForm()) {
                // Recoger los datos del formulario
                const nombre_completo = document.getElementById('name').value;
                const edad = document.getElementById('age').value;
                const telefono = document.getElementById('phone').value;

                // Enviar los datos a la API
                fetch('http://35.169.14.147:8080/registro', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ nombre_completo, edad, telefono })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Registro exitoso');
                        // Guardar el ID del usuario en localStorage
                        localStorage.setItem('userId', data.insertId);
                        window.location.href = 'bp.html';
                    } else {
                        alert('Error al registrar: ' + data.error);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error en el servidor');
                });
            }
        });
    }

    // Manejo de la narración y redirección
    if (narrationElement) {
        const narrations = [
            "Ha caído del cielo",
            "¿Qué es esto?",
            "Hay una nota",
            "La forma de encontrar lo deseado",
            "Es entender ...",
            "El berilo no es lo unico que brilla"
        ];
        let currentNarration = 0;

        function showNarration() {
            if (currentNarration < narrations.length) {
                narrationElement.textContent = narrations[currentNarration];
                narrationElement.classList.add('fade-in');
                currentNarration++;

                setTimeout(() => {
                    narrationElement.classList.remove('fade-in');
                    narrationElement.classList.add('fade-out');

                    if (currentNarration === 1) { // Después de la primera narración
                        setTimeout(() => {
                            showParticles();
                        }, 2000);
                    } else {
                        setTimeout(() => {
                            narrationElement.classList.remove('fade-out');
                            showNarration();
                        }, 2000); // Tiempo de fade-out
                    }
                }, 2000); // Tiempo de visualización
            } else {
                showIframe();
            }
        }

        function showParticles() {
            particlesContainer.classList.remove('hidden');

            for (let i = 0; i < 90; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                particle.style.setProperty('--x', `${Math.random() * 400 - 200}px`);
                particle.style.setProperty('--y', `${Math.random() * 400 - 200}px`);
                particlesContainer.appendChild(particle);
            }

            setTimeout(() => {
                particlesContainer.classList.add('hidden');
                narrationElement.classList.remove('fade-out');
                showNarration();
            }, 4000); // Tiempo para que las partículas exploten
        }

        function showIframe() {
            // Redirigir a key.html al llegar a la última narración
            window.location.href = 'key.html';
        }

        showNarration();
    } else if (window.location.pathname.endsWith('key.html')) {
        setTimeout(() => {
            window.location.href = 'fp.html';
        }, 7000);
    }

    // Código para capturar el tiempo
if (window.location.pathname.endsWith('fp.html')) {
    const startTime = new Date().getTime();
    const userId = localStorage.getItem('userId'); // Obtener el ID del usuario almacenado en localStorage
    const timerElement = document.getElementById('timer');
    const codeInput = document.getElementById('codeInput');

    function updateTimer() {
        const currentTime = new Date().getTime();
        const timeElapsed = ((currentTime - startTime) / 1000).toFixed(1); // tiempo en segundos con 1 decimal
        timerElement.textContent = `Tiempo: ${timeElapsed}s`;
    }

    const timerInterval = setInterval(updateTimer, 100); // Actualizar cada 100 ms

    codeInput.addEventListener('input', async () => {
        if (codeInput.value === 'dnske') {
            const endTime = new Date().getTime();
            const timeTaken = ((endTime - startTime) / 1000).toFixed(1); // tiempo en segundos con 1 decimal
            clearInterval(timerInterval); // Detener el temporizador
            alert(`Correcto! Tomaste ${timeTaken} segundos en encontrar el código.`);

            try {
                const response = await fetch('http://35.169.14.147:8080/update-time', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: userId, tiempo: timeTaken })
                });

                const data = await response.json();

                if (data.success) {
                    console.log('Tiempo actualizado exitosamente');
                    window.location.href = 'podium.html';
                } else {
                    console.error('Error al actualizar el tiempo:', data.error);
                }
            } catch (error) {
                console.error('Error en el servidor:', error);
            }
        }
    });
}

async function fetchPodium(userId) {
    try {
        const response = await fetch(`http://35.169.14.147:8080/podio/${userId}`);
        const data = await response.json();

        if (data.top3 && data.user) {
            console.log('Top 3:', data.top3);
            console.log('User Position:', data.user);

            // Mostrar el Top 3
            const top3List = document.getElementById('top3-list');
            top3List.innerHTML = '';
            data.top3.forEach((user, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${index + 1}. ${user.nombre_completo} - ${user.tiempo}s`;
                top3List.appendChild(listItem);
            });

            // Mostrar la posición del usuario
            const userPositionInfo = document.getElementById('user-position-info');
            userPositionInfo.textContent = `Posición: ${data.user.position}, Nombre: ${data.user.nombre_completo}, Tiempo: ${data.user.tiempo}s`;
        } else {
            console.error('Error al obtener el podio:', data.error);
        }
    } catch (error) {
        console.error('Error en el servidor:', error);
    }
}

if (window.location.pathname.endsWith('podium.html')) {
    const userId = localStorage.getItem('userId');
    if (userId) {
        fetchPodium(userId);
    } else {
        alert('Usuario no registrado.');
        return;
    }

    async function fetchPodium(userId) {
        try {
            const response = await fetch(`http://35.169.14.147:8080/podio/${userId}`);
            const data = await response.json();

            if (data.top3 && data.user) {
                console.log('Top 3:', data.top3);
                console.log('User Position:', data.user);

                // Mostrar el Top 3
                const top3List = document.getElementById('top3-list');
                if (top3List) {
                    top3List.innerHTML = '';
                    data.top3.forEach((user, index) => {
                        const listItem = document.createElement('li');
                        listItem.textContent = `${index + 1}. ${user.nombre_completo} - ${user.tiempo}s`;
                        top3List.appendChild(listItem);
                    });
                }

                // Mostrar la posición del usuario
                const userPositionInfo = document.getElementById('user-position-info');
                if (userPositionInfo) {
                    userPositionInfo.textContent = `Posición: ${data.user.posicion}, Nombre: ${data.user.nombre_completo}, Tiempo: ${data.user.tiempo}s`;
                }

                // Crear gráficas para los tres primeros lugares
                createChart('chart1', data.top3[0].nombre_completo, data.top3[0].tiempo, 'rgb(75, 192, 192)');
                createChart('chart2', data.top3[1].nombre_completo, data.top3[1].tiempo, 'rgb(153, 102, 255)');
                createChart('chart3', data.top3[2].nombre_completo, data.top3[2].tiempo, 'rgb(255, 159, 64)');
            } else {
                console.error('Error al obtener el podio:', data.error);
            }
        } catch (error) {
            console.error('Error en el servidor:', error);
        }
    }

    function createChart(elementId, label, time, color) {
        new Chart(document.getElementById(elementId), {
            type: 'bar',
            data: {
                labels: [label],
                datasets: [{
                    label: 'Tiempo (s)',
                    data: [time],
                    backgroundColor: [color]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}



});

