const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const usersRouter = require("./users/users-router");
const authRouter = require("./auth/auth-router");

const server = express();

server.use(
  session({
    name: "chocolatechip",
    secret: "shh",
    cookie: {
      maxAge: 1000 * 30,
      secure: false,
      httpOnly: false,
    },
    resave: false,
    saveUninitialized: false,
    store: new KnexSessionStore({
      knex: require("../data/db-config"),
      tablename: "sessions",
      sidfieldname: "sid",
      createtable: true,
      clearInterval: 1000 * 60 * 60,
    }),
  })
);

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use("/api/users", usersRouter);
server.use("/api/auth", authRouter);

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

// eslint-disable-next-line no-unused-vars
server.use((err, req, res, next) => {
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
