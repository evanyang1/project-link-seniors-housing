import express from "express";
import {
  createListing,
  getListings,
  getListing,
  updateListing,
  deleteListing,
  searchListings,
} from "../controllers/listingController";
import { auth, checkRole } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/", getListings);
router.get("/search", searchListings);
router.get("/:id", getListing);

// Protected routes (require authentication)
router.post("/", auth, checkRole(["senior"]), createListing);
router.patch("/:id", auth, checkRole(["senior"]), updateListing);
router.delete("/:id", auth, checkRole(["senior"]), deleteListing);

export default router;
