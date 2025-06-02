// login.js - Versión corregida

document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.container');
    const loginForm = document.querySelector('.form-box.login form');
    const registerForm = document.querySelector('.form-box.register form');
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');

    // Alternar vistas
    registerBtn.addEventListener('click', () => {
        container.classList.add('active');
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove('active');
    });

    // ✅ CORRECCIÓN: Rutas de API corregidas
    // Login
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = loginForm.querySelector('input[type="text"]').value.trim();
        const password = loginForm.querySelector('input[type="password"]').value.trim();

        if (!username || !password) {
            showMessage('Por favor, completa todos los campos para iniciar sesión.', 'error');
            return;
        }

        try {
            console.log('Enviando datos de login:', { email: username });
            
            // ✅ Usar la ruta correcta según tu backend
            const response = await fetch('/api/autenticacion/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ 
                    email: username,
                    password: password 
                })
            });

            console.log('Respuesta del servidor:', response.status, response.statusText);
            
            // ✅ MANEJO MEJORADO DE LA RESPUESTA
            let data;
            try {
                data = await response.json();
                console.log('Datos recibidos:', data);
            } catch (parseError) {
                console.error('Error al parsear JSON:', parseError);
                throw new Error('Respuesta del servidor no válida');
            }

            if (response.ok) {
                // ✅ ADAPTARSE A DIFERENTES ESTRUCTURAS DE RESPUESTA
                let token, usuario;
                
                // Verificar diferentes estructuras posibles
                if (data.body && data.body.data) {
                    // Estructura: { body: { data: { token, usuario } } }
                    token = data.body.data.token;
                    usuario = data.body.data.usuario;
                } else if (data.data) {
                    // Estructura: { data: { token, usuario } }
                    token = data.data.token;
                    usuario = data.data.usuario;
                } else if (data.token) {
                    // Estructura directa: { token, usuario }
                    token = data.token;
                    usuario = data.usuario;
                } else {
                    console.error('Estructura de respuesta no reconocida:', data);
                    throw new Error('Estructura de respuesta no válida');
                }

                if (token) {
                    // ✅ Guardar en sessionStorage
                    sessionStorage.setItem('token', token);
                    if (usuario) {
                        sessionStorage.setItem('usuario', JSON.stringify(usuario));
                    }
                    
                    showMessage('¡Login exitoso! Redirigiendo...', 'success');
                    
                    // Redirigir después de un breve delay
                    setTimeout(() => {
                        window.location.href = '/productos';
                    }, 1500);
                } else {
                    throw new Error('Token no recibido del servidor');
                }
            } else {
                // ✅ MANEJO DE ERRORES MEJORADO
                let errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';
                
                if (data.message) {
                    errorMessage = data.message;
                } else if (data.body && typeof data.body === 'string') {
                    errorMessage = data.body;
                } else if (data.error) {
                    errorMessage = data.error;
                }
                
                console.error('Error del servidor:', data);
                showMessage(errorMessage, 'error');
            }
        } catch (error) {
            console.error('Error en login:', error);
            showMessage('Error de conexión. Intenta de nuevo más tarde.', 'error');
        } finally {
            // Restaurar botón
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // ✅ NUEVAS FUNCIONES DE UTILIDAD
    function showMessage(message, type = 'info') {
        // Crear elemento de mensaje
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        // Estilos del mensaje
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        // Colores según tipo
        switch(type) {
            case 'success':
                messageDiv.style.backgroundColor = '#10b981';
                break;
            case 'error':
                messageDiv.style.backgroundColor = '#ef4444';
                break;
            default:
                messageDiv.style.backgroundColor = '#3b82f6';
        }
        
        document.body.appendChild(messageDiv);
        
        // Animar entrada
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover después de 4 segundos
        setTimeout(() => {
            messageDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 300);
        }, 4000);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ✅ Verificar si ya está logueado
    const token = sessionStorage.getItem('token');
    if (token) {
        // Verificar si el token es válido
        fetch('/api/autenticacion/verify', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (!data.error) {
                // Usuario ya logueado, redirigir
                window.location.href = '/productos';
            }
        })
        .catch(() => {
            // Token inválido, limpiar storage
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('usuario');
        });
    }
});