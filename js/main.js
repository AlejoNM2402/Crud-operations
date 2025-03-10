
        document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar elementos del DOM
    const emailInput = document.querySelector('.email input');
    const passwordInput = document.querySelector('.password input');
    const signInButton = document.querySelector('.caja.n5 button');
    
    // Crear elemento para mensajes de error
    const errorContainer = document.createElement('div');
    errorContainer.style.color = '#ff0000';
    errorContainer.style.fontSize = '14px';
    errorContainer.style.marginTop = '10px';
    errorContainer.style.textAlign = 'center';
    errorContainer.style.display = 'none';
    
    // Insertar el contenedor de error después del botón
    const buttonContainer = document.querySelector('.caja.n5');
    buttonContainer.appendChild(errorContainer);
    
    // Función para cargar las credenciales guardadas
    async function loadCredentials() {
        try {
            // Primero intentamos cargar desde localStorage
            const storedData = localStorage.getItem('userData');
            if (storedData) {
                return [JSON.parse(storedData)];
            }
            
            // Si no hay datos en localStorage, intentamos cargar el archivo JSON
            const response = await fetch('credentials.json');
            if (response.ok) {
                const data = await response.json();
                // Si es un objeto simple lo convertimos en array
                return Array.isArray(data) ? data : [data];
            } else {
                console.error('No se pudo cargar el archivo credentials.json');
                return [];
            }
        } catch (error) {
            console.error('Error al cargar credenciales:', error);
            return [];
        }
    }
    
    // Función para validar el inicio de sesión
    async function validateLogin(email, password) {
        const credentials = await loadCredentials();
        
        // Si no hay credenciales, no se puede validar
        if (credentials.length === 0) {
            return false;
        }
        
        // Buscar coincidencia de email y contraseña
        return credentials.some(cred => 
            cred.email === email && cred.password === password
        );
    }
    
    // Manejar clic en botón de inicio de sesión
    signInButton.addEventListener('click', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        // Validar que los campos no estén vacíos
        if (!email || !password) {
            errorContainer.textContent = 'Por favor, complete todos los campos';
            errorContainer.style.display = 'block';
            return;
        }
        
        // Mostrar indicador de carga
        signInButton.disabled = true;
        signInButton.textContent = 'Verificando...';
        
        // Validar credenciales
        const isValid = await validateLogin(email, password);
        
        if (isValid) {
            // Crear mensaje de éxito
            errorContainer.textContent = 'Inicio de sesión exitoso. Redirigiendo...';
            errorContainer.style.color = 'green';
            errorContainer.style.display = 'block';
            
            // Guardar sesión actual
            const currentUser = {
                email: email,
                lastLogin: new Date().toISOString()
            };
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Redireccionar a dashboard
            setTimeout(function() {
                window.location.href = 'views/dashboard.html';
            }, 1500);
        } else {
            // Mostrar error
            errorContainer.textContent = 'Email o contraseña incorrectos';
            errorContainer.style.color = '#ff0000';
            errorContainer.style.display = 'block';
            
            // Restablecer botón
            signInButton.disabled = false;
            signInButton.textContent = 'SIGN IN';
        }
    });
    
    // Limpiar mensajes de error cuando el usuario comienza a escribir
    emailInput.addEventListener('input', function() {
        errorContainer.style.display = 'none';
    });
    
    passwordInput.addEventListener('input', function() {
        errorContainer.style.display = 'none';
    });
});
   
    