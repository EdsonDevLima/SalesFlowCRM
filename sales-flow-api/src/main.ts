
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {

  console.log('DATABASE_PASSWORD:', process.env.DATABASE_PASSWORD);
  console.log('DATABASE_USERNAME:', process.env.DATABASE_USERNAME);
  console.log('DATABASE_NAME:', process.env.DATABASE_NAME);
  
  const app = await NestFactory.create(AppModule, { bodyParser: true });
    app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  await app.listen(process.env.DEFAULT_PORT || 3000);
}
bootstrap();