import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getAllWishlistItems, createWishlistItem, updateWishlistItem, deleteWishlistItem } from '../controllers/wishlist.controller';

const router = Router();

router.use(authenticate);

router.get('/', getAllWishlistItems);
router.post('/', createWishlistItem);
router.put('/:id', updateWishlistItem);
router.delete('/:id', deleteWishlistItem);

export default router;
