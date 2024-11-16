import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './user/auth.module';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [AuthModule,  MongooseModule.forRoot('mongodb://localhost:27017/nestdb'),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
