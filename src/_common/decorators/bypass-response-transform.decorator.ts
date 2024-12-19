import { BYPASS_RESPONSE_TRANSFORM } from '@/_common/constants/decorator-keys.constant';
import { SetMetadata } from '@nestjs/common';

export const BypassResponseTransform = () =>
  SetMetadata(BYPASS_RESPONSE_TRANSFORM, true);
