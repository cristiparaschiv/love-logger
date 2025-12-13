import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export class FileService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = env.UPLOAD_DIR;
  }

  /**
   * Process and save an uploaded image
   * Supports all image formats including HEIC/HEIF from iOS devices
   * Sharp automatically converts HEIC to JPEG for maximum compatibility
   *
   * @param file - The uploaded file buffer
   * @param directory - Subdirectory within uploads (e.g., 'vacations')
   * @param maxWidth - Maximum width in pixels (default: 1920)
   * @param quality - JPEG quality (default: 85)
   * @returns The relative file path
   */
  async processAndSaveImage(
    file: Express.Multer.File,
    directory: string,
    maxWidth: number = 1920,
    quality: number = 85
  ): Promise<string> {
    try {
      logger.info(`Processing image upload: ${file.originalname} (${file.mimetype}, ${file.size} bytes)`);

      // Generate unique filename
      const fileExtension = '.jpg'; // Always convert to JPEG for compatibility
      const randomName = crypto.randomBytes(16).toString('hex');
      const filename = `${randomName}${fileExtension}`;

      // Create directory path
      const dirPath = path.join(this.uploadDir, directory);
      await this.ensureDirectoryExists(dirPath);

      // Full file path
      const filePath = path.join(dirPath, filename);

      // Process image with sharp (automatically handles HEIC/HEIF conversion)
      await sharp(file.buffer)
        .resize(maxWidth, undefined, {
          fit: 'inside',
          withoutEnlargement: true,
        })
        .jpeg({ quality, progressive: true })
        .toFile(filePath);

      // Return relative path (for storage in database)
      const relativePath = `/${directory}/${filename}`;
      logger.info(`Image saved: ${relativePath}`);

      return relativePath;
    } catch (error) {
      logger.error('Failed to process and save image:', error);
      throw new Error('Failed to process image');
    }
  }

  /**
   * Delete a file
   * @param relativePath - The relative path of the file (e.g., '/vacations/abc123.jpg')
   */
  async deleteFile(relativePath: string): Promise<void> {
    try {
      // Remove leading slash if present
      const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
      const filePath = path.join(this.uploadDir, cleanPath);

      // Check if file exists
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        logger.info(`File deleted: ${relativePath}`);
      } catch (error) {
        // File doesn't exist, that's okay
        logger.warn(`File not found for deletion: ${relativePath}`);
      }
    } catch (error) {
      logger.error('Failed to delete file:', error);
      throw new Error('Failed to delete file');
    }
  }

  /**
   * Ensure directory exists, create if not
   */
  private async ensureDirectoryExists(dirPath: string): Promise<void> {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
      logger.info(`Directory created: ${dirPath}`);
    }
  }

  /**
   * Validate file is an image
   */
  validateImageFile(file: Express.Multer.File): boolean {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/heic',
      'image/heif',
      'image/avif'
    ];
    return allowedMimeTypes.includes(file.mimetype);
  }

  /**
   * Validate file size
   */
  validateFileSize(file: Express.Multer.File, maxSize: number = env.MAX_FILE_SIZE): boolean {
    return file.size <= maxSize;
  }
}

export const fileService = new FileService();
