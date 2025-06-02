// Recibe un array de roles permitidos
module.exports = function verificarRol(rolesPermitidos = []) {
    return (req, res, next) => {
      if (!req.usuario) return res.status(401).json({ error: 'No autenticado' });
      if (!rolesPermitidos.includes(req.usuario.rol)) {
        return res.status(403).json({ error: 'Rol no autorizado' });
      }
      next();
    };
  };
  