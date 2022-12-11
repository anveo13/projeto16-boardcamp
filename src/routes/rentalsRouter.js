import { Router } from 'express';

import { deleteRental, getRentals, postRentals, postRentalsById } from '../controllers/rentalsController.js';

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", postRentals);
router.post("/rentals/:id/return", postRentalsById);
router.delete("/rentals/:id", deleteRental)

export default router;