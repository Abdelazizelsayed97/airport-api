import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { sout } from 'src/users/users.service';

export const CurrentUser = createParamDecorator(
  (data: any, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const token = ctx.getContext().headers.authorization.split(' ')[1];
    const user = new JwtService().decode(token);
    sout(user);
    return user;
  },
);
