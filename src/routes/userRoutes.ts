import express from 'express';
import { getUsers } from './../controllers/userController';
import { register } from './../controllers/authController';
const router = express.Router();

router.post('', register);
router.get('', getUsers);

export default router;
