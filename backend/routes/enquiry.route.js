import express from 'express';
import { 
  createEnquiry, 
  getManagerEnquiries, 
  getTenantEnquiries, 
  updateEnquiryStatus 
} from '../controllers/enquiry.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create', verifyToken, createEnquiry);
router.get('/manager', verifyToken, getManagerEnquiries);
router.get('/tenant', verifyToken, getTenantEnquiries);
router.post('/status/:id', verifyToken, updateEnquiryStatus);

export default router;
