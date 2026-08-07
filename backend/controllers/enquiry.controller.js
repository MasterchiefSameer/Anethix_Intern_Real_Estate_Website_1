import Enquiry from '../models/enquiry.model.js';
import Listing from '../models/listing.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const createEnquiry = async (req, res, next) => {
  const { listingId, name, email, phone, message, type } = req.body;
  try {
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return next(errorHandler(404, 'Property listing not found!'));
    }

    // A user cannot enquire about their own listing
    if (listing.userRef === req.user.id) {
      return next(errorHandler(400, 'You cannot enquire about your own listing!'));
    }

    // Verify tenant role
    const tenantUser = await User.findById(req.user.id);
    if (!tenantUser || tenantUser.role !== 'Tenant') {
      return next(errorHandler(403, 'Only tenants can submit property enquiries.'));
    }

    const newEnquiry = new Enquiry({
      tenantId: req.user.id,
      managerId: listing.userRef,
      listingId,
      name,
      email,
      phone,
      message,
      type: type || 'Enquire',
    });

    await newEnquiry.save();
    res.status(201).json(newEnquiry);
  } catch (error) {
    next(error);
  }
};

export const getManagerEnquiries = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find({ managerId: req.user.id })
      .populate('listingId')
      .populate('tenantId', 'username email avatar')
      .sort({ createdAt: -1 });
    res.status(200).json(enquiries);
  } catch (error) {
    next(error);
  }
};

export const getTenantEnquiries = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find({ tenantId: req.user.id })
      .populate('listingId')
      .sort({ createdAt: -1 });
    res.status(200).json(enquiries);
  } catch (error) {
    next(error);
  }
};

export const updateEnquiryStatus = async (req, res, next) => {
  const { status } = req.body;
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return next(errorHandler(404, 'Enquiry not found!'));
    }

    // Ensure the authenticated user is the assigned manager
    if (enquiry.managerId.toString() !== req.user.id) {
      return next(errorHandler(401, 'You are not authorized to update this enquiry!'));
    }

    enquiry.status = status;
    await enquiry.save();
    res.status(200).json(enquiry);
  } catch (error) {
    next(error);
  }
};
