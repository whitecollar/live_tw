import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule)
    app.enableCors()

    await app.listen(4001)
  } catch (error) {
    console.log(error)
  }
}
bootstrap()
