import { Router } from 'express';
import { getCustomers, postCustomers, getCustomersById, putCustomersById } from '../controllers/custumersController';

const router = Router();

router.get("/customers", getCustomers);
router.post("/customers", postCustomers);
router.get('/customers/:id', getCustomersById);
router.put('/customers/:id', putCustomersById);

export default router;