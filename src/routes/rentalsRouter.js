import { Router } from 'express';

import { deleteRental, getRentals, getRentalsById, postRentals } from '../controllers/rentalsController.js';

const router = Router();

router.get("/rentals", getRentals);
router.post("/rentals", postRentals);
router.get("/rentals", getRentalsById);
router.delete("/rentals/:id", deleteRental)

export default router;