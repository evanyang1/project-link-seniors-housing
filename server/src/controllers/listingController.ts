import { Request, Response } from 'express';
import { Listing, IListing } from '../models/Listing';

export const createListing = async (req: Request, res: Response) => {
  try {
    const listing = new Listing({
      ...req.body,
      owner: req.user._id,
    });

    await listing.save();
    res.status(201).json({
      message: 'Listing created successfully',
      listing,
    });
  } catch (error: any) {
    res.status(400).json({
      message: 'Failed to create listing',
      error: error.message,
    });
  }
};

export const getListings = async (req: Request, res: Response) => {
  try {
    const {
      city,
      state,
      minPrice,
      maxPrice,
      type,
      status = 'active',
      page = 1,
      limit = 10,
    } = req.query;

    const query: any = { status };

    if (city) query['location.city'] = new RegExp(city as string, 'i');
    if (state) query['location.state'] = new RegExp(state as string, 'i');
    if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };
    if (type) query.type = type;

    const listings = await Listing.find(query)
      .populate('owner', 'firstName lastName email profilePicture')
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Listing.countDocuments(query);

    res.json({
      listings,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalListings: total,
    });
  } catch (error: any) {
    res.status(400).json({
      message: 'Failed to fetch listings',
      error: error.message,
    });
  }
};

export const getListing = async (req: Request, res: Response) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('owner', 'firstName lastName email profilePicture bio');

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json(listing);
  } catch (error: any) {
    res.status(400).json({
      message: 'Failed to fetch listing',
      error: error.message,
    });
  }
};

export const updateListing = async (req: Request, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'title',
    'description',
    'price',
    'location',
    'amenities',
    'rules',
    'images',
    'availability',
    'requirements',
    'status',
  ];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    const listing = await Listing.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    updates.forEach((update) => {
      (listing as any)[update] = req.body[update];
    });

    await listing.save();
    res.json({
      message: 'Listing updated successfully',
      listing,
    });
  } catch (error: any) {
    res.status(400).json({
      message: 'Failed to update listing',
      error: error.message,
    });
  }
};

export const deleteListing = async (req: Request, res: Response) => {
  try {
    const listing = await Listing.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.json({ message: 'Listing deleted successfully' });
  } catch (error: any) {
    res.status(400).json({
      message: 'Failed to delete listing',
      error: error.message,
    });
  }
};

export const searchListings = async (req: Request, res: Response) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const listings = await Listing.find(
      { $text: { $search: q as string }, status: 'active' },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .populate('owner', 'firstName lastName email profilePicture')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    const total = await Listing.countDocuments({
      $text: { $search: q as string },
      status: 'active',
    });

    res.json({
      listings,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      totalListings: total,
    });
  } catch (error: any) {
    res.status(400).json({
      message: 'Search failed',
      error: error.message,
    });
  }
}; 