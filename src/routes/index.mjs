import { Router } from "express";
import productsRouter from "./products.routes.mjs";
import cartsRouter from "./carts.routes.mjs";
import sessionRouter from "./sessions.routes.mjs";
import emailRouter from "./email.routes.mjs";
import mocksRouter from "./mock.routes.mjs";

const router = Router();

router.use("/products", productsRouter);
router.use("/carts", cartsRouter);
router.use("/session", sessionRouter);
router.use("/email", emailRouter);
router.use("/mocks", mocksRouter);

export default router;
