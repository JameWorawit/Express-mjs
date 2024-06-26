import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";

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
