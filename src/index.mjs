import express from "express";
import routes from "./routes/index.mjs";
import { mockUsers } from "./utils/constants.mjs";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(routes);

//Get Params
app.get("/", (req, res) => {
  const { body } = req;
  res.status(201).send((mockUsers[0] = { ...body }));
});

//server not dotevn 
app.listen(PORT, () => {
  console.log(`localhost:${PORT}`);
});
