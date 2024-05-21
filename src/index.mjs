import express, { json, response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, username: "Jame", displayName: "jame" },
  { id: 2, username: "Jack", displayName: "jack01" },
  { id: 3, username: "Jhon", displayName: "jHonOK" },
];

//Get Params
app.get("/", (req, res) => {
  res.status(201).send("Hello World");
});

//Query Params
app.get("/api/users", (req, res) => {
  const { query: {filter, value} } = req;
  if (filter && value) {
    return res.status(201).send(mockUsers.filter((user) => user[filter].includes(value)));
  }
  return res.status(201).send(mockUsers);
});

//Route Params
app.get("/api/users/:id", (req, res) => {
  const parsedId = parseInt(req.params.id);
  if (isNaN(parsedId)) {
    return res.status(400).send({ msg: "Bad Request. Invalid ID." });
  }

  const findeUser = mockUsers.find((user) => user.id === parsedId);
  if (!findeUser) {
    return res.sendStatus(404);
  }
  return res.send(findeUser);
});

//server
app.listen(PORT, () => {
  console.log(`localhost:${PORT}`);
});
