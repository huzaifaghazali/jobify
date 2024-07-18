import { Router } from 'express';
import {
  validateJobInput,
  validateIdParam,
} from '../middlewares/validationMiddleware.js';
import {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobController.js';

const router = Router();

router.route('/').get(getAllJobs).post(validateJobInput, createJob);
router
  .route('/:id')
  .get(validateIdParam, getJob)
  .patch(validateJobInput, validateIdParam, updateJob)
  .delete(validateIdParam, deleteJob);

export default router;
