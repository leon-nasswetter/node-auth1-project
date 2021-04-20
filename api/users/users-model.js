const db = require("../../data/db-config");

function find() {
  return db("users").column("user_id", "username").orderBy("user_id");
}

function findBy(filter) {
  return db("users").where(filter);
}

function findById(user_id) {
  return db("users").where({ user_id }).first();
}

async function add(user) {
  const [id] = await db("users").insert(user, "user_id");
  return findById(id);
}

module.exports = {
  find,
  findBy,
  findById,
  add,
};
