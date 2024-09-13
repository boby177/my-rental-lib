import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { swaggerConfig } from '@config';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const port = configService.get('API_PORT') || 3000;
  const apiVersion = configService.get('API_VERSION');
  const apiURL = configService.get('API_URL_LOCAL');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  swaggerConfig(app, apiVersion);
  await app.listen(port);

  Logger.log(`App is running on port: ${port}`);
  Logger.log(
    `Swagger: ${apiURL}:${port}/api/docs/v${apiVersion}/web`,
  );
}
bootstrap();
