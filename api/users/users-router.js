const router = require("express").Router();
const Users = require("./users-model.js");

const { restricted } = require("../auth/auth-middleware");

router.get("/", restricted, (req, res, next) => {
  Users.find()
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(next);
});

module.exports = router;
