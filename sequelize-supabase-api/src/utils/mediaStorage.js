const crypto = require('crypto');
const sharp = require('sharp');
const { createClient } = require('@supabase/supabase-js');
const env = require('../config/env');
const AppError = require('./AppError');

const BUCKET = 'complaint-media';
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// Server-side client. The secret key bypasses Row Level Security, so it must never reach the frontend.
const supabase = createClient(env.supabase.url, env.supabase.secretKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const compressImage = async (buffer) => {
  try {
    return await sharp(buffer)
      .rotate() // respects EXIF orientation from phone cameras
      .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 78 })
      .toBuffer();
  } catch {
    throw new AppError('One of the images could not be processed', 400);
  }
};

// Uploads each file to Supabase Storage. Images become WebP, videos are stored as-is.
// Returns [{ type, path }], where path is the object key inside the bucket.
const saveComplaintMedia = async (files = []) => {
  const saved = [];

  try {
    for (const file of files) {
      const id = crypto.randomUUID();
      const isImage = IMAGE_TYPES.includes(file.mimetype);

      const buffer = isImage ? await compressImage(file.buffer) : file.buffer;
      const ext = isImage ? 'webp' : 'mp4';
      const contentType = isImage ? 'image/webp' : 'video/mp4';
      const objectPath = `complaints/${id}.${ext}`;

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(objectPath, buffer, { contentType, upsert: false });

      if (error) throw new Error(`Supabase upload failed: ${error.message}`);

      saved.push({ type: isImage ? 'image' : 'video', path: objectPath });
    }
    return saved;
  } catch (err) {
    // Roll back anything already uploaded for this request
    await deleteComplaintMedia(saved);
    throw err instanceof AppError ? err : new AppError('Could not upload media, please try again', 502);
  }
};

// Removes objects from the bucket. Used when uploads succeed but the database insert fails.
const deleteComplaintMedia = async (media = []) => {
  if (!media.length) return;
  const paths = media.map((m) => m.path);
  const { error } = await supabase.storage.from(BUCKET).remove(paths);
  if (error) console.error('Failed to clean up media:', error.message);
};

// Builds the public URL for a stored object. Synchronous, so serializers can use it directly.
const toPublicUrl = (objectPath) =>
  `${env.supabase.url}/storage/v1/object/public/${BUCKET}/${objectPath}`;

module.exports = { saveComplaintMedia, deleteComplaintMedia, toPublicUrl };
