import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getRelationshipConfig, setRelationshipStartDate } from '../controllers/relationship.controller';

const router = Router();

router.use(authenticate);

router.get('/', getRelationshipConfig);
router.put('/', setRelationshipStartDate);

export default router;
