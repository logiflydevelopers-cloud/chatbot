import express from "express";
import {
  getAdminCustomers,
  getAdminChat,
  getDashboardCounts,
  getFilteredCustomers
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/customers/:userId", getAdminCustomers);
router.get("/customers/:userId/filter", getFilteredCustomers);
router.get("/chats", getAdminChat);
router.get("/dashboard-counts", getDashboardCounts);


export default router;
