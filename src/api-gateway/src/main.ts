import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
// import { doubleCsrf } from 'csrf-csrf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT;

  app.use(cookieParser());
  // const { doubleCsrfProtection } = doubleCsrf({
  //   getSecret: () => process.env.CSRF_KEY,
  // });
  // app.use(doubleCsrfProtection);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix('api');
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
