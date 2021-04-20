const router = require("express").Router();
const bcrypt = require("bcryptjs");
const User = require("../users/users-model");
const {
  checkPasswordLength,
  checkUsernameExists,
  checkUsernameFree,
} = require("./auth-middleware");

router.post(
  "/register",
  checkUsernameFree,
  checkPasswordLength,
  async (req, res, next) => {
    const { username, password } = req.body;
    const hash = bcrypt.hashSync(password, 10);
    const userForDataBase = { username, password: hash };

    await User.add(userForDataBase)
      .then((user) => {
        res.json(user);
      })
      .catch(next);
  }
);

router.post("/login", checkUsernameExists, async (req, res, next) => {
  const { username, password } = req.body;

  await User.findBy({ username })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.user = user;
        res.status(200).json({ message: `Welcome ${username}!` });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch(next);
});

// eslint-disable-next-line no-unused-vars
router.get("/logout", (req, res, next) => {
  if (req.session && req.session.user) {
    req.session.destroy((err) => {
      if (err) {
        res.json({ message: "you cannot leave" });
      } else {
        res.status(200).json({ message: "logged out" });
      }
    });
  } else {
    res.status(200).json({ message: "no session" });
  }
});

module.exports = router;
