'use strict';
require('dotenv').config({
  path: '/Volumes/Data/backend projects/airport-api/.env',
});

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

import { GraphqlResponseInspector } from 'users/inspectors/users.response.inspector';
import { PermissionsGuard } from 'permissions/guard/permissions.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      always: true,
    }),
  );
  // app.useGlobalInterceptors(new GraphqlResponseInspector());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
