document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar elementos del DOM utilizando selectores CSS
    const emailInput = document.querySelector('.email input');
    const passwordInput = document.querySelector('.password input');
    const submitButton = document.querySelector('button[type="submit"]');
    
    // Añadir elemento para mensaje de error
    const emailContainer = document.querySelector('.email');
    const errorMessage = document.createElement('span');
    errorMessage.style.color = '#ff0000';
    errorMessage.style.fontSize = '12px';
    errorMessage.style.display = 'none';
    errorMessage.textContent = 'Por favor, ingrese un email válido';
    emailContainer.appendChild(errorMessage);
    
    // Función para validar email
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Validar email mientras escribe
    emailInput.addEventListener('input', function() {
        const isValid = validateEmail(this.value);
        
        if (isValid || this.value === '') {
            // Email válido o campo vacío
            errorMessage.style.display = 'none';
            this.style.border = '';
        } else {
            // Email inválido
            errorMessage.style.display = 'block';
            this.style.border = '1px solid #ff0000';
        }
    });
    
    // Función para guardar datos en archivo JSON descargable
    function saveToJsonFile(data) {
        // Crear objeto Blob con el contenido JSON
        const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        
        // Crear enlace de descarga
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(jsonBlob);
        downloadLink.download = 'credentials.json';
        
        // Añadir temporalmente a la página y activar la descarga
        document.body.appendChild(downloadLink);
        downloadLink.click();
        
        // Limpiar
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(downloadLink.href);
    }
    
    // Manejar clic en botón de envío
    submitButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        const email = emailInput.value;
        const password = passwordInput.value;
        
        // Validar email
        if (!validateEmail(email)) {
            errorMessage.style.display = 'block';
            emailInput.style.border = '1px solid #ff0000';
            emailInput.focus();
            return; // Detener procesamiento
        }
        
        // Crear objeto de usuario
        const userData = {
            email: email,
            password: password,
            timestamp: new Date().toISOString()
        };
        
        // Guardar en localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Guardar en archivo JSON
        saveToJsonFile(userData);
        
        // Mostrar mensaje de éxito (crear elemento para mostrar mensaje)
        const successMsg = document.createElement('div');
        successMsg.textContent = 'Cuenta creada exitosamente. Redirigiendo a index.html...';
        successMsg.style.backgroundColor = 'rgba(0, 128, 0, 0.1)';
        successMsg.style.border = '1px solid green';
        successMsg.style.color = 'green';
        successMsg.style.padding = '10px';
        successMsg.style.marginTop = '10px';
        successMsg.style.borderRadius = '4px';
        successMsg.style.textAlign = 'center';
        
        // Agregar mensaje después del botón
        const buttonContainer = document.querySelector('.caja.n5');
        buttonContainer.appendChild(successMsg);
        
        console.log('Datos guardados:', userData);
        
        // Redireccionar a index.html después de 2 segundos
        setTimeout(function() {
            window.location.href = '../index.html';
        }, 2000);
    });
});