import { UserController } from "../controller/user";
import { UserRepository } from "../repository/user";
import { UserService } from "../service/user";
import { Router } from "express";

const router = Router();

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get("/fetch-user-data", userController.getAllUsers);
router.get("/fetch-user-data/:uid", userController.getUser);
router.put("/update-user-data/:uid", userController.updateUser);

export default router;
