import express, { json, response } from "express";
import fetch from "node-fetch";
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors());
//middleware
const loggingMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};

const resloveIndexByUserId = async (req, res, next) => {
  const response = await fetch(URL);
  const json = await response.json();
  const {
    params: { id },
  } = req;

  const userId = parseInt(id);
  if (isNaN(userId)) {
    return res.sendStatus(400);
  }
  const findUserIndex = json.findIndex((user) => user.id === userId); // userId = 2 findUserIndex = 1 (เพราะ index 1 มี id = 2)
  if (findUserIndex === -1) {
    return res.sendStatus(404);
  }
  req.findUserIndex = findUserIndex; //ส่ง obj req ไปยัง app.put
  req.json = json;
  next();
};

const PORT = process.env.PORT || 3000;

const URL = `https://jsonplaceholder.typicode.com/users`; //hardcode

app.get("/", async (req, res) => {
  try {
    const response = await fetch(URL);
    const json = await response.json();
    return res.status(201).json({ json });
  } catch {
    console.error(error);
    res.status(500).send("Error query data");
  }
});

//route
app.get("/api/users", async (req, res) => {
  try {
    const response = await fetch(URL);
    const json = await response.json();

    const {
      query: { filter, value },
    } = req; //ใช้หลักการ destructuring  โดย re-name property ของ query  เป็น filter,value ซึ่งเป็น keyทั้งคู่

    if (!filter && !value) {
      return res.send(json);
    } else if (filter && value) {
      return res.send(json.filter((user) => user[filter].includes(value))); //เข้าถึง propertyโดยใช้ [] และใช้ .includes()เช็คค่าถ้ามีจะส่ง  ture ถ้าไม่จะส่ง false
    }
    return res.send(json);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error query data");
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const response = await fetch(URL);
    const json = await response.json();
    const { body } = req;
    const newUser = { id: json[json.length - 1].id + 1, ...body }; //id:json [เข้าถึง array ข้อมูลตัวสุดท้ายด้วยวิธี -1].id +1เมื่อมีค่าเพิ่มเข้ามา,...body คือเก็บค่าที่เพิ่มเข้ามาเช่น name:'',username:''
    json.push(newUser);
    return res.status(201).send(newUser);
  } catch (error) {
    res.status(500).send({ msg: "Not found" });
  }
});

app.get("/api/users/:id", async (req, res) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    return res.status(400).send({ msg: "Bad request" });
  }
  try {
    const response = await fetch(`${URL}/${userId}`);
    const json = await response.json();
    const toArray = [json] //เป็นเพราะ API ฝั่งนู้นนน ทำให้ต้องทำเป็น Array
    console.log(toArray)
    const foundUser = toArray.find((user) => user.id === userId);
    if (!foundUser) {
      return res.status(404).send({ msg: "Not Found" });
    } else {
      return res.send(foundUser);
    }
  } catch (error) {
    res.status(500).send("Error fetching data");
  }
});

app.put("/api/users/:id", resloveIndexByUserId, async (req, res) => {
  const { body, findUserIndex, json } = req;
  json[findUserIndex] = { id: json[findUserIndex].id, ...body }; //แก้โดยการส่งค่า obj ผ่าน req 
  console.log(json[findUserIndex]);
  return res.sendStatus(200);
});

app.patch("/api/users/:id", async (req, res) => {
  const response = await fetch(URL);
  const json = await response.json();
  const {
    body,
    params: { id },
  } = req;
  const userId = parseInt(id);
  if (isNaN(userId)) {
    return res.sendStatus(400);
  }
  const findUserIndex = json.findIndex((user) => user.id === userId); // userId = 2 findUserIndex = 1 (เพราะ index 1 มี id = 2)
  if (findUserIndex === -1) {
    return res.sendStatus(404);
  }
  json[findUserIndex] = { ...json[findUserIndex], ...body }; //{...json[index]}แสดงค่าใน indexที่กำหนด ,...body ส่งค่าที่จะอัพเดทเข้าไปใน index
  return res.sendStatus(200);
});

app.delete("/api/users/:id", async (req, res) => {
  const response = await fetch(URL);
  const json = await response.json();
  const jsonToArray = [json];
  const {
    params: { id },
  } = req;

  const userId = parseInt(id);

  if (isNaN(userId)) {
    return res.sendStatus(400);
  }

  const findUserIndex = json.findIndex((user) => user.id === userId);
  if (findUserIndex === -1) {
    return res.sendStatus(404);
  }
  jsonToArray.splice(findUserIndex); //ศึกษาเพิ่มเกี่ยวกับ splice slice
  return res.sendStatus(200);
});

//server
app.listen(PORT, () => {
  console.log(`localhost:${PORT}`);
});
