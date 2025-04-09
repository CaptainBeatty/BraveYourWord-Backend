const jwt = require('jsonwebtoken');

// Middleware pour authentifier les requêtes via JWT
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization; // Récupérer l'en-tête Authorization
  if (!authHeader) {
    return res.status(401).json({ error: 'Accès non autorisé : Aucun token fourni' });
  }

  const token = authHeader.split(' ')[1]; // Extraire le token après "Bearer"
  if (!token) {
    return res.status(401).json({ error: 'Token manquant dans l\'en-tête' });
  }

  try {
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    req.user = decoded;
    req.user._id = decoded.id;
    next(); // Continuer avec la requête
  } catch (err) {
    console.error('Erreur de validation du token:', err);
    return res.status(403).json({ error: 'Token invalide ou expiré' });
  }
};

module.exports = authenticate;
