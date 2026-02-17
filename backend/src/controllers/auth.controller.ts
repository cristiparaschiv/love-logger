import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';
import { updateProfileSchema, changePasswordSchema } from '../utils/validator';

export class AuthController {
  login = asyncHandler(async (req: Request, res: Response) => {
    const { username, password, rememberMe } = req.body;

    const result = await authService.login(username, password, rememberMe || false);

    res.status(200).json(result);
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token is required' });
    }

    const result = await authService.refreshToken(refreshToken);

    res.status(200).json(result);
  });

  me = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = req.headers.authorization?.substring(7) || '';
    const user = await authService.verifyToken(token);

    res.status(200).json({ user });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    res.status(200).json({ message: 'Logged out successfully' });
  });

  updateProfile = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { displayName } = updateProfileSchema.parse(req.body);
    const user = await authService.updateProfile(req.user.id, displayName);

    res.status(200).json({ user });
  });

  changePassword = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    await authService.changePassword(req.user.id, currentPassword, newPassword);

    res.status(200).json({ message: 'Password changed successfully' });
  });
}

export const authController = new AuthController();
