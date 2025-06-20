// app.js - Versión corregida y limpia

const express = require('express');
const path = require('path');
const cors = require('cors');
const config = require('./config');

// Importar módulos
const auth = require('./rutas/autenticacion');
const productRoutes = require('./modelos/Producto');

const app = express();


// Configuración
app.set('port', config.app.port);

// ✅ MIDDLEWARES
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging para desarrollo
if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// ✅ SERVIR ARCHIVOS ESTÁTICOS
app.use(express.static(path.join(__dirname, '../Frontend')));

// ✅ RUTAS DE LA API
app.use('/api/autenticacion',auth);
app.use('/api/products', productRoutes);

// ✅ RUTAS DE PÁGINAS
// Ruta raíz - Login
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/vistas/login.html'));
});

// Ruta de productos (página principal después del login)
app.get('/productos', (req, res) => {
    res.sendFile(path.join(__dirname, '../Frontend/vistas/usuarios.html'));
});

// ✅ Ruta de dashboard (alias para productos)
app.get('/dashboard', (req, res) => {
    res.redirect('/productos');
});

// Ruta de salud del servidor
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// ✅ MIDDLEWARE DE AUTENTICACIÓN PARA RUTAS PROTEGIDAS
const { autenticar } = require('./controladores/autenticacionControlador');

// Ejemplo de ruta protegida
app.get('/admin', autenticar, (req, res) => {
    // Verificar si es admin
    if (req.usuario.rol !== 'admin' && req.usuario.rol !== 'master') {
        return res.status(403).send('Acceso denegado');
    }
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Panel de Administración</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .header { background: #f0f0f0; padding: 20px; border-radius: 8px; }
                .info { margin: 20px 0; }
                .btn { background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Panel de Administración</h1>
                <p>Bienvenido, ${req.usuario.nombre}</p>
            </div>
            <div class="info">
                <h3>Información del usuario:</h3>
                <ul>
                    <li><strong>ID:</strong> ${req.usuario.id}</li>
                    <li><strong>Email:</strong> ${req.usuario.email}</li>
                    <li><strong>Rol:</strong> ${req.usuario.rol}</li>
                </ul>
            </div>
            <a href="/productos" class="btn">Ir a Productos</a>
            <a href="/" class="btn" onclick="localStorage.clear(); sessionStorage.clear();">Cerrar Sesión</a>
        </body>
        </html>
    `);
});

// ✅ API DE SALUD/STATUS
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// ✅ MANEJO DE ERRORES
// Middleware para rutas no encontradas
app.use((req, res, next) => {
    const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
    error.status = 404;
    next(error);
});

// Middleware de manejo de errores global
app.use((error, req, res, next) => {
    console.error('Error capturado:', error);
    
    const status = error.status || 500;
    
    // Si es una petición a la API, devolver JSON
    if (req.path.startsWith('/api/')) {
        res.status(status).json({
            error: true,
            status: status,
            mensaje: status === 404 ? 'Endpoint no encontrado' : 'Error interno del servidor',
            ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
        });
    } else {
        // Si es una página y es 404, redirigir al login
        if (status === 404) {
            res.redirect('/');
        } else {
            res.status(status).send(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Error ${status}</title>
                    <style>
                        body { 
                            font-family: Arial, sans-serif; 
                            text-align: center; 
                            margin-top: 100px; 
                        }
                        .error { color: #dc3545; }
                        .btn { 
                            background: #007bff; 
                            color: white; 
                            padding: 10px 20px; 
                            text-decoration: none; 
                            border-radius: 4px; 
                            margin-top: 20px;
                            display: inline-block;
                        }
                    </style>
                </head>
                <body>
                    <h1 class="error">Error ${status}</h1>
                    <p>Ha ocurrido un error en el servidor.</p>
                    <a href="/" class="btn">Volver al inicio</a>
                </body>
                </html>
            `);
        }
    }
});

// ✅ MANEJO GRACEFUL DE SHUTDOWN
process.on('SIGTERM', () => {
    console.log('Recibida señal SIGTERM, cerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('Recibida señal SIGINT, cerrando servidor...');
    process.exit(0);
});

// Manejo del favicon para evitar errores 404
app.get('/favicon.ico', (req, res) => {
    res.status(204).end(); // Devuelve "No Content" sin error
});

module.exports = app;