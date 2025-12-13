import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth.middleware';
import {
  getAllVacations,
  getUpcomingVacations,
  getPastVacations,
  getVacationById,
  createVacation,
  updateVacation,
  deleteVacation,
} from '../controllers/vacations.controller';

const router = Router();

// Configure multer for memory storage (we'll process with Sharp)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    // Accept images only
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

// All routes require authentication
router.use(authenticate);

// GET /api/vacations - Get all vacations
router.get('/', getAllVacations);

// GET /api/vacations/upcoming - Get upcoming vacations
router.get('/upcoming', getUpcomingVacations);

// GET /api/vacations/past - Get past vacations
router.get('/past', getPastVacations);

// GET /api/vacations/:id - Get vacation by ID
router.get('/:id', getVacationById);

// POST /api/vacations - Create new vacation (with optional photo)
router.post('/', upload.single('photo'), createVacation);

// PUT /api/vacations/:id - Update vacation (with optional photo)
router.put('/:id', upload.single('photo'), updateVacation);

// DELETE /api/vacations/:id - Delete vacation
router.delete('/:id', deleteVacation);

export default router;
