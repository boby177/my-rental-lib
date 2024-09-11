import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

const web = {
  title: 'My Rental Lib API (Web Version)',
  description: 'My Rental Library API Documentation for website',
} as const;

export function swaggerConfig(app: INestApplication, apiVersion?: string) {
  const webOptions = new DocumentBuilder()
    .setTitle(web.title)
    .setDescription(web.description)
    .setVersion(apiVersion)
    .build();

  const webDocument = SwaggerModule.createDocument(app, webOptions);
  SwaggerModule.setup(`api/docs/v${apiVersion}/web`, app, webDocument);
}
