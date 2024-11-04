import { Router } from 'express';
import { PlaylistService } from '../services/playlist.service';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createPlaylistSchema,
  updatePlaylistSchema,
  mediaIdsSchema,
  branchIdsSchema,
  updateSettingsSchema
} from '../schemas/playlist.schema';

export const playlistRouter = Router();
const playlistService = new PlaylistService();

playlistRouter.use(authenticate);

playlistRouter.post(
  '/',
  authorize('admin'),
  validate(createPlaylistSchema),
  async (req, res, next) => {
    try {
      const playlist = await playlistService.create(req.body);
      res.status(201).json(playlist);
    } catch (error) {
      next(error);
    }
  }
);

playlistRouter.get('/', async (req, res, next) => {
  try {
    const playlists = await playlistService.findAll();
    res.json(playlists);
  } catch (error) {
    next(error);
  }
});

playlistRouter.get('/:id', async (req, res, next) => {
  try {
    const playlist = await playlistService.findById(req.params.id);
    res.json(playlist);
  } catch (error) {
    next(error);
  }
});

playlistRouter.patch(
  '/:id',
  authorize('admin'),
  validate(updatePlaylistSchema),
  async (req, res, next) => {
    try {
      const playlist = await playlistService.update(req.params.id, req.body);
      res.json(playlist);
    } catch (error) {
      next(error);
    }
  }
);

playlistRouter.delete('/:id', authorize('admin'), async (req, res, next) => {
  try {
    await playlistService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

playlistRouter.post(
  '/:id/media',
  authorize('admin'),
  validate(mediaIdsSchema),
  async (req, res, next) => {
    try {
      const playlist = await playlistService.addMedia(req.params.id, req.body.mediaIds);
      res.json(playlist);
    } catch (error) {
      next(error);
    }
  }
);

playlistRouter.delete(
  '/:id/media',
  authorize('admin'),
  validate(mediaIdsSchema),
  async (req, res, next) => {
    try {
      const playlist = await playlistService.removeMedia(req.params.id, req.body.mediaIds);
      res.json(playlist);
    } catch (error) {
      next(error);
    }
  }
);

playlistRouter.post(
  '/:id/branches',
  authorize('admin'),
  validate(branchIdsSchema),
  async (req, res, next) => {
    try {
      const playlist = await playlistService.assignToBranches(req.params.id, req.body.branchIds);
      res.json(playlist);
    } catch (error) {
      next(error);
    }
  }
);

playlistRouter.delete(
  '/:id/branches',
  authorize('admin'),
  validate(branchIdsSchema),
  async (req, res, next) => {
    try {
      const playlist = await playlistService.removeBranches(req.params.id, req.body.branchIds);
      res.json(playlist);
    } catch (error) {
      next(error);
    }
  }
);

playlistRouter.patch(
  '/:id/settings',
  authorize('admin'),
  validate(updateSettingsSchema),
  async (req, res, next) => {
    try {
      const playlist = await playlistService.updateSettings(req.params.id, req.body);
      res.json(playlist);
    } catch (error) {
      next(error);
    }
  }
);