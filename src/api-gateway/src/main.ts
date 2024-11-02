import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { CsrfFilter, nestCsrf } from 'ncsrf';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? 3000;

  // Parse cookies and CSRF tokens
  app.use(cookieParser());
  // Enable CSRF protection (Cross-Site Request Forgery)
  app.use(nestCsrf());
  // Apply CSRF protection globally for all controllers in the application
  app.useGlobalFilters(new CsrfFilter());
  // Apply validation globally for all controllers in the application
  app.useGlobalPipes(new ValidationPipe());
  // Set global prefix for all controllers in the application
  app.setGlobalPrefix('api');
  // Enable CORS for all routes
  app.use(
    cors({
      credentials: true,
      origin: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Api Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}...`);
  });
}
bootstrap();
