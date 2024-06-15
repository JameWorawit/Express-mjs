import { Router } from "express";

const router = Router();

router.get("/api/products", (req, res) => {
    return res.status(200).send([{ id: 1, name: "Pepsi", pice: "50 Bath" }]);
  });


export default router;