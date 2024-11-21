import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { doubleCsrf } from 'csrf-csrf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // CORS
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
  });
  // CSRF
  const { doubleCsrfProtection } = doubleCsrf({
    getSecret: () => process.env.CSRF ?? 'Secret',
  });
  app.use(doubleCsrfProtection);
  // PREFIX
  app.setGlobalPrefix('api');
  // SWAGGER
  const config = new DocumentBuilder()
    .setTitle('Api Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  // LISTEN
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
