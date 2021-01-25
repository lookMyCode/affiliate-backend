import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LinkSchema } from 'src/schemas/link.schema';
import { ProfileSchema } from 'src/schemas/profile.schema';
import { ProfileController } from './profile/profile.controller';
import { ProfileService } from './profile/profile.service';
import { LinkController } from './link/link.controller';
import { LinkService } from './link/link.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Profile', schema: ProfileSchema },
      { name: 'Link', schema: LinkSchema }

    ])
  ],
  providers: [ProfileService, LinkService],
  controllers: [ProfileController, LinkController]
})
export class AffiliateModule {}
