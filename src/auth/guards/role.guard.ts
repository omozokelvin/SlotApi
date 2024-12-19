import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RoleService } from '@/role/role.service';
import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';

//  RoleGuard already extends JwtAuthGuard
@Injectable()
export class RoleGuard extends JwtAuthGuard {
  private readonly newLogger = new Logger(RoleGuard.name);

  constructor(private readonly roleService: RoleService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    try {
      const args = context.getArgs()[0];

      const path = args?.route?.path || '';
      const method = args?.route?.stack[0]?.method || '';

      await super.canActivate(context);

      const { user } = args;

      const roleIds: Array<string> = (user?.roles || []).map((item) =>
        item?.id?.toString(),
      );

      const roles = await Promise.all(
        roleIds.map((role) => this.roleService.getById(role)),
      );

      const allowed = roles.some((role) =>
        role.apiRoutes.some(
          (route) => route.path === path && route.method === method,
        ),
      );

      if (!allowed) {
        throw new ForbiddenException(
          `You are not allowed to perform ${method?.toUpperCase()} on ${path}`,
        );
      }

      return allowed;
    } catch (error) {
      this.newLogger.error(error, 'Role guard failed');
      throw error;
    }
  }
}
