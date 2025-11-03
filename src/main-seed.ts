import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SeedModule } from './seed/seed.module';

async function bootstrap() {
  const app = await NestFactory.create(SeedModule);
  app.setGlobalPrefix('/api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
