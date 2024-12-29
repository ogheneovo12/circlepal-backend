import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Mentorfy API')
  .setDescription('A Product of Mentorfy Technologies')
  .setVersion('1.0')
  .addTag('default')
  .addTag('auth')
  .addTag('user')
  .addTag('media')
  .build();
