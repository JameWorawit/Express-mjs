import express, { response } from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(
  session({
    secret: "anson the dev",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);
app.use(routes);

//server please use .env !!
app.listen(PORT, () => {
  console.log(`localhost:${PORT}`);
});

//Set Cookies
app.get("/", (req, res) => {
  res.cookie("hello", "world", { maxAge: 20000, signed: true });
  res.cookie("username", "john@gmail.com", { maxAge: 20000 });

  console.log(req.session.id);
  req.session.visited = true; //แก้การส่ง session id ซ้ำ
  res.status(201).send({ msg: "hello" });
});

app.post("/api/auth", (req, res) => {
  const {
    body: { username, password },
  } = req;
  const findUser = mockUsers.find((user) => user.username === username);
  if (!findUser || findUser.password !== password) {
    return res.status(401).send({ msg: "BAD CREDENTIALS" });
  }
  req.session.user = findUser;
  return res.status(200).send(findUser);
});

app.get("/api/auth/status", (req, res) => {
  req.sessionStore.get(req.sessionID, (err, session) => {
    console.log(session);
  });
  return req.session.user
    ? res.status(200).send(req.session.user)
    : res.status(400).send({ msg: "No Authenticated" });
});

app.post("/api/cart", (req, res) => {
  if (!req.session.user) {
    return res.sendStatus(401);
  }
  const { body: item } = req;
  const { cart } = req.session;

  if (cart) {
    cart.push(item);
  } else {
    req.session.cart = [item];
  }
  return res.status(201).send(item);
});

app.get("/api/cart", (req, res) => {
  if (!req.session.user) {
    return res.sendStatus(401);
  }
  return res.send(req.session.cart ?? []);
});
