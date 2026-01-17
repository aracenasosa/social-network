import multer from "multer";
import type { Request, Response, NextFunction } from "express";

// Constants for file upload limits
const MAX_PHOTO_COUNT = 5;
const MAX_VIDEO_COUNT = 2;
const MAX_PHOTO_SIZE = 5 * 1024 * 1024; // 5MB per photo
const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20MB per video
const MAX_TOTAL_SIZE = 40 * 1024 * 1024; // 40MB total for all files

// Upload configuration for single profile photos
export const uploadSingle = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 1,
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: (_req, file, cb) => {
    const ok = file.mimetype.startsWith("image/");

    if (!ok) return cb(new Error("Only images are allowed"));
    cb(null, true);
  },
});

// Upload configuration for post media (photos and videos)
export const uploadPostMedia = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: MAX_PHOTO_COUNT + MAX_VIDEO_COUNT, // Max 7 files (5 photos + 2 videos)
  },
  fileFilter: (_req, file, cb) => {
    const ok =
      file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/");

    if (!ok) return cb(new Error("Only images and videos are allowed"));
    cb(null, true);
  },
}).array("media", MAX_PHOTO_COUNT + MAX_VIDEO_COUNT);

// Validate post media limits with granular checks
export function validatePostMediaLimits(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const files = (req.files as Express.Multer.File[]) || [];

  // Categorize files by type
  const photos = files.filter((f) => f.mimetype.startsWith("image/"));
  const videos = files.filter((f) => f.mimetype.startsWith("video/"));

  // 1. Check photo count
  if (photos.length > MAX_PHOTO_COUNT) {
    return res.status(400).json({
      message: `Maximum ${MAX_PHOTO_COUNT} photos allowed. You uploaded ${photos.length}.`,
    });
  }

  // 2. Check video count
  if (videos.length > MAX_VIDEO_COUNT) {
    return res.status(400).json({
      message: `Maximum ${MAX_VIDEO_COUNT} videos allowed. You uploaded ${videos.length}.`,
    });
  }

  // 3. Check individual photo sizes
  for (const photo of photos) {
    if (photo.size > MAX_PHOTO_SIZE) {
      return res.status(400).json({
        message: `Photo "${photo.originalname}" is ${(photo.size / (1024 * 1024)).toFixed(2)}MB. Maximum photo size is ${MAX_PHOTO_SIZE / (1024 * 1024)}MB.`,
      });
    }
  }

  // 4. Check individual video sizes
  for (const video of videos) {
    if (video.size > MAX_VIDEO_SIZE) {
      return res.status(400).json({
        message: `Video "${video.originalname}" is ${(video.size / (1024 * 1024)).toFixed(2)}MB. Maximum video size is ${MAX_VIDEO_SIZE / (1024 * 1024)}MB.`,
      });
    }
  }

  // 5. Check total size of ALL files
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  if (totalSize > MAX_TOTAL_SIZE) {
    return res.status(400).json({
      message: `Total upload size is ${(totalSize / (1024 * 1024)).toFixed(2)}MB. Maximum total size is ${MAX_TOTAL_SIZE / (1024 * 1024)}MB.`,
      breakdown: {
        photos: `${photos.length} photos (${(photos.reduce((sum, p) => sum + p.size, 0) / (1024 * 1024)).toFixed(2)}MB)`,
        videos: `${videos.length} videos (${(videos.reduce((sum, v) => sum + v.size, 0) / (1024 * 1024)).toFixed(2)}MB)`,
      },
    });
  }

  next();
}

// Legacy function - keeping for backwards compatibility
export function enforceTotalUploadSize(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const files = (req.files as Express.Multer.File[]) || [];
  const total = files.reduce((sum, f) => sum + (f.size ?? 0), 0);

  if (total > 50 * 1024 * 1024) {
    return res.status(413).json({
      message: `Total upload size exceeds 50MB. Received ${(total / (1024 * 1024)).toFixed(2)}MB.`,
    });
  }

  next();
}
