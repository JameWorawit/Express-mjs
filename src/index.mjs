import express, { response } from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";
import passport from "passport";
import mongoose from "mongoose";
import "./strategies/local-strategy.mjs";
import MongoStore from "connect-mongo";

const app = express();
const PORT = 8000;

mongoose.connect('mongodb://127.0.0.1:27017/express-es6')
  .then(() => console.log('Connected to Database'))
  .catch((err) => console.log(`Error: ${err}`))

app.use(express.json());
app.use(cookieParser("helloworld"));
app.use(
  session({
    secret: "anson the dev",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 6000 * 60,
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient()

    })
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);

//** Passport **
app.post('/api/auth', passport.authenticate("local"), (req, res) => {
  res.sendStatus(200)
});

app.get('/api/auth/status', (req, res) => {
  console.log(`Inseid /auth/status endpoint`);
  console.log(req.user);
  console.log(req.session);
  return req.user ? res.send(req.user) : res.sendStatus(401);
});

app.post('/api/auth/logout', (req, res) => {
  if (!req.user) {
    return res.sendStatus(401);
  }
  req.logout((err) => {
    if (err) {
      return res.sendStatus(400);
    }
    res.sendStatus(200);
  });
});


// ** Old auth **
// app.post("/api/auth", (req, res) => {
//   const { body: { username, password }, } = req;

//   const findUser = mockUsers.find((user) => user.username === username);
//   if (!findUser || findUser.password !== password) {
//     return res.status(401).send({ msg: "BAD CREDENTIALS" });
//   }
//   req.session.user = findUser;
//   return res.status(200).send(findUser);
// });

// app.get("/api/auth/status", (req, res) => {
//   req.sessionStore.get(req.sessionID, (err, session) => {
//     console.log(req.sessionID);
//   });
//   return req.session.user
//     ? res.status(200).send(req.session.user)
//     : res.status(400).send({ msg: "No Authenticated" });
// });


//  CART
app.post("/api/cart", passport.authenticate("local") ,(req, res) => {

  if (!req.user.id) {
    return res.sendStatus(401);
  }
  const item = req.body;
  if (!req.session.cart) {
    req.session.cart = [];
  }
  req.session.cart.push(item)
  return res.status(201).send(item);
});

app.get("/api/cart", passport.authenticate("local"), (req, res) => {
  console.log("user.id")
  if (!req.id) {
    return res.sendStatus(401);
  }
  return res.send(req.session.cart ?? []);
});

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


