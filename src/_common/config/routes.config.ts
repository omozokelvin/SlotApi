import { ApiRouteDto } from '@/role/dtos/api-route.dto';
import { RoleService } from '@/role/role.service';
import { Logger } from '@nestjs/common';

export async function syncRoutes(app) {
  const server = app.getHttpServer();
  const router = server._events.request._router;

  const availableRoutes: Array<ApiRouteDto> = router.stack
    .map((layer) => {
      if (layer.route) {
        return {
          path: layer.route?.path.toLowerCase(),
          method: layer.route?.stack[0].method.toLowerCase(),
        };
      }

      return undefined;
    })
    .filter((item) => item !== undefined)
    .filter((item) => !item.path.includes('/api'));

  const roleService: RoleService = app.get(RoleService);
  const logger = new Logger('syncRoutes');

  await roleService.setApiRoutes(availableRoutes).then().catch(logger.error);
}
