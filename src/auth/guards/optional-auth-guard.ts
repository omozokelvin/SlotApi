import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// when you want it to use JWT if it's available, or just allow if jwt is not available. authenticated or not, you should rarely use this. except you have logic in your service to serve both authenticated and unauthenticated users, and logic to restrict their access
@Injectable()
export class OptionalAuthGuard extends AuthGuard(['jwt', 'anonymous']) {}
