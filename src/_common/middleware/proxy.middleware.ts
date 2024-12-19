import { Injectable, NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (req.url.startsWith('/external-images')) {
      createProxyMiddleware({
        target: 'https://img.shields.io',
        changeOrigin: true,
        pathRewrite: {
          '^/external-images': '',
        },
      })(req, res, next);
    } else {
      next();
    }
  }
}
