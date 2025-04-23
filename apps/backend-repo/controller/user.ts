import { User, UpdateUserPayload } from "@repo/entities/user";
import { UserService } from "../service/user";
import { Request, Response } from "express";
import { validateHeader } from "../middleware/authMiddleware";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  getAllUsers = async (req: Request, res: Response) => {
    validateHeader(req, res, async () => {
      try {
        const users = await this.userService.getAllUsers();
        res.json(users);
      } catch (err) {
        res.status(500).json({ messsage: err });
      }
    });
  };

  getUser = async (req: Request, res: Response) => {
    validateHeader(req, res, async () => {
      const userId = req.params.uid;
      try {
        const user = await this.userService.getUser(userId);
        if (user) res.json(user);
        else res.status(404).json({ message: "User not found" });
      } catch (err) {
        res.status(500).json({ messsage: err });
      }
    });
  };

  updateUser = async (req: Request, res: Response) => {
    validateHeader(req, res, async () => {
      const userId = req.params.uid;
      try {
        const updatedUser: UpdateUserPayload = req.body;
        const user = await this.userService.updateUser(userId, updatedUser);
        if (user) res.json(user);
        else res.status(404).json({ message: "User not found" });
      } catch (err) {
        res.status(500).json({ message: err });
      }
    });
  };
}
