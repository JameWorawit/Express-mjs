import express, { response } from "express";
import fetch from "node-fetch";
const app = express();

const PORT = process.env.PORT || 3000;


app.get("/", (req, res) => {
  res.status(201).json({ products });
});

//route
const URL = `https://jsonplaceholder.typicode.com/users`;
app.get("/api/users", async (req, res) => {
    try {
      const response = await fetch(URL);
      const json = await response.json();
     
      const {query: { filter, value} } = req; //ใช้หลักการ destructuring  โดย re-name property ของ query  เป็น filter,value ซึ่งเป็น keyทั้งคู่
      console.log(req.query);
    
      if(!filter && !value ){
          return res.send(json);
        }else if(filter && value ){
            return res.send(json.filter((user) => user[filter].includes(value))) ; //เข้าถึง propertyโดยใช้ [] และใช้ .includes()เช็คค่าถ้ามีจะส่ง  ture ถ้าไม่จะส่ง false 
        }
        return res.send(json);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error query data");
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
    const jsonToArray = [json]; //แก้เสร็จใข้ array ครอบอีกที
    const foundUser = jsonToArray.find((user) => user.id === userId);
    console.log(foundUser);
    if (!foundUser) {
      return res.status(404).send({ msg: "Not Found" });
    } else {
      return res.send(foundUser);
    }
    res.json(json);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data");
  }
});



app.listen(PORT, () => {
  console.log(`localhost:${PORT}`);
});
