import { Router } from "express";

const router = Router();

router.get("/api/products", (req, res) => {
  console.log(req.headers.cookie);
  console.log(req.cookies);
  console.log(req.signedCookies.hello);
  if (req.signedCookies.hello && req.signedCookies.hello === "world") {
    return res.status(200).send([{ id: 1, name: "Pepsi", pice: "50 Bath" }]);
  } else {
    return res.status(403).send({ msg: "Sorry. You need the correct cookie" });
  }
});

router.get("/api/checkusername", (req, res) => {
  if (req.cookies.username && req.cookies.username === "john@gmail.com") {
    return res.status(200).send([{ id: 1, user: req.cookies.username }]);
  } else {
    return res.status(403).send({ msg: "Sorry. You need the correct cookie" });
  }
});
export default router;
