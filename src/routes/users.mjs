import { Router } from "express";
import {
  query,
  validationResult,
  checkSchema,
  matchedData,
} from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveIndexByUserId } from "../middleware/middlewares.mjs";
import { User } from "../mongoeDB/schema/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";

const router = Router();

//Query Params
router.get(
  "/api/users",
  query("filter").isString().notEmpty().withMessage("Must not be empty").isLength({ min: 3, max: 10 }).withMessage("Must be at least 3-10 charaters"),
  (req, res) => {
    //session
    req.sessionStore.get(req.session.id, (err, sessionData) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log(sessionData);
    });


    const result = validationResult(req);
    // console.log(result);
    const { query: { filter, value } } = req;
    if (filter && value) {
      return res.status(201).send(mockUsers.filter((user) => user[filter].includes(value)));
    }
    return res.status(201).send(mockUsers);
  }
);

//Route Params
router.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  const findeUser = mockUsers[findUserIndex];
  if (!findeUser) {
    return res.sendStatus(404);
  }
  return res.send(findeUser);
});

//Post Params
router.post("/api/users",
  checkSchema(createUserValidationSchema),
  async (req, res) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return res.status(400).send(result.array());
    }
    const data = matchedData(req)
    console.log(data)
    data.password = hashPassword(data.password)
    console.log(data)
    const newUser = new User(data);
    try {
      const saveUser = await newUser.save();
      return res.status(201).send(saveUser);
    } catch (err) {
      console.log(err)
      return res.sendStatus(400)
    }
  });

//PUT Requests
router.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;
  /**
   * id: mockUsers[findUserIndex].id ไว้อ้างถึง obj id เพื่อไม่ให้ค่า id เปลี่ยนแปลงจากการอัพเดทจาก method put  (เดิมใช้ id: parsedId เพื่อเก็บค่าไอดีไว้)
   * อันใหม่ใช้ id:  mockUsers[findUserIndex].id จัดการโดย middleware resolveIndexByUserId
   * เนื่องจาก parsedId นำไปเทียบค่าใน findUserIndex แล้วได้ค่าตรงตามที่ต้องการจึงใช้ mockUsers[findUserIndex].id แทนและเข้าถึง obj id ได้เลย
   */
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return res.sendStatus(200);
});

//Patch Requests
router.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  //...mockUsers[findUserIndex] เป็นการกระจายข้อมูลเดิม , ...body คือข้อมูลใหม่ที่กรอกลงไป
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.sendStatus(200);
});

//Delete Requests
router.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  mockUsers.splice(findUserIndex, 1);
  return res.sendStatus(200);
});
export default router;
