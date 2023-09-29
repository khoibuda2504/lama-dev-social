const router = require("express").Router();
const jwt = require('jsonwebtoken')

router.post("/", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400)
  jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err, decoded) => {
    if (err) return res.sendStatus(403);
    const accessToken = jwt.sign({ user: decoded }, process.env.JWT_ACCESS_TOKEN, {
      expiresIn: '30m'
    })
    return res.status(200).json({
      ...decoded.user,
      accessToken,
      refreshToken
    })
  });
})

module.exports = router