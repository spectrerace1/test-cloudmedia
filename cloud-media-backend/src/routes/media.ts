import { Router } from 'express';
import multer from 'multer';
import { MediaService } from '../services/media.service';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { updateMediaSchema } from '../schemas/media.schema';
import { Request } from 'express';

// Extend Request type to include file from multer
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const mediaRouter = Router();
const mediaService = new MediaService();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

mediaRouter.use(authenticate);

// Upload media file
mediaRouter.post(
  '/upload',
  authorize('admin'),
  upload.single('file'),
  async (req: MulterRequest, res, next) => {
    try {
      if (!req.file) {
        throw new Error('No file uploaded');
      }
      const media = await mediaService.upload(req.file);
      res.status(201).json(media);
    } catch (error) {
      next(error);
    }
  }
);

// Get all media files
mediaRouter.get('/', async (req, res, next) => {
  try {
    const media = await mediaService.findAll();
    res.json(media);
  } catch (error) {
    next(error);
  }
});

// Get single media file
mediaRouter.get('/:id', async (req, res, next) => {
  try {
    const media = await mediaService.findById(req.params.id);
    res.json(media);
  } catch (error) {
    next(error);
  }
});

// Get streaming URL
mediaRouter.get('/:id/stream', async (req, res, next) => {
  try {
    const url = await mediaService.getStreamUrl(req.params.id);
    res.json({ url });
  } catch (error) {
    next(error);
  }
});

// Update media name
mediaRouter.patch(
  '/:id',
  authorize('admin'),
  validate(updateMediaSchema),
  async (req, res, next) => {
    try {
      const media = await mediaService.update(req.params.id, req.body.name);
      res.json(media);
    } catch (error) {
      next(error);
    }
  }
);

// Delete media file
mediaRouter.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    await mediaService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Get media metadata
mediaRouter.get('/:id/metadata', async (req, res, next) => {
  try {
    const metadata = await mediaService.getMetadata(req.params.id);
    res.json(metadata);
  } catch (error) {
    next(error);
  }
});