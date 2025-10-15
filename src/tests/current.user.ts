import { createParamDecorator, ExecutionContext } from '@nestjs/common';

const CurrentUser = createParamDecorator(
    (data: any, context: ExecutionContext) => {
        
        return context.switchToHttp().getRequest().user;
  },
);
