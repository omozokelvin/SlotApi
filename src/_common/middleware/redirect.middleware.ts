import { Injectable, NestMiddleware } from '@nestjs/common';
import { join } from 'path';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RedirectMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.path === '/documentation') {
      res.sendFile(join(process.cwd(), 'documentation', 'index.html'));
    } else {
      next();
    }
  }
}
