import express from "express";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser('helloworld'));
app.use(routes);

//server please use .env !!
app.listen(PORT, () => {
  console.log(`localhost:${PORT}`);
});

//Get Params
app.get("/", (req, res) => {
  res.cookie("hello", "world", { maxAge: 30000, signed: true });
  res.status(201).send({ msg: "hello" });
});
