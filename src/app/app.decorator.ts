import { applyDecorators, Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

/**
 * 复合装饰器
 */
export function ApiController(route: string, name: string = route) {
  return applyDecorators(
    ApiBearerAuth(), //
    ApiTags(name),
    Controller(route),
  );
}
