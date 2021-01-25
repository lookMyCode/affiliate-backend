import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AffiliateModule } from './affiliate/affiliate.module';

const DB_PASS = 'zaq12WSX';
const DB_NAME = 'affiliate';
const DB_URL = `mongodb+srv://dima:${DB_PASS}@cluster0.vqb5y.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

@Module({
  imports: [
    MongooseModule.forRoot(DB_URL, { useNewUrlParser: true }),
    AffiliateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
