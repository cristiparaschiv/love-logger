import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { asyncHandler } from '../utils/asyncHandler';

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

    res.status(200).json({
      user: req.user,
    });
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    // With JWT, logout is handled client-side by removing tokens
    // Server-side logout would require a token blacklist (future enhancement)
    res.status(200).json({ message: 'Logged out successfully' });
  });
}

export const authController = new AuthController();
