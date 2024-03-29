const jtw = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).send({ error: 'No auth token provided' });

  const parts = authHeader.split(' ');

  if (!parts.lenght === 2) return res.status(401).send({ error: 'Token error' });

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) return res.status(401).send({ error: 'Token bad formatted' });

  return jtw.verify(token, authConfig.secret, (err, decoded) => {
    if (err) return res.status(401).send({ error: 'Token Invalid' });

    req.userId = decoded.id;
    return next();
  });
};
