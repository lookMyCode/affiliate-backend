import { GetLinkByShortNameDto } from './../../dto/getLinkByShortName.dto';
import { GetLinkByIdDto } from './../../dto/get-link-by-id.dto';
import { AddLinkDto } from './../../dto/add-link.dto';
import { ProfileService } from './../profile/profile.service';
import { TokenDto } from './../../dto/token.dto';
import { ILink, IProfile, IRes } from './../../interfaces';
import { HttpStatus, Injectable } from "@nestjs/common";
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class LinkService {

  constructor(
    @InjectModel('Link') private readonly linkModel: Model<ILink>,
    @InjectModel('Profile') private readonly profileModel: Model<IProfile>,
    private profileService: ProfileService
  ) {}

  async getAll(tokenDto: TokenDto): Promise<IRes> {

    try {
      const profile = await this.profileService.getProfileByToken(tokenDto.token);

      if (!profile) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          statusText: 'UNAUTHORIZED',
          message: 'Wrong token'
        }
      }

      const links = await this.linkModel
        .find({_autorId: profile._id})
        .exec();

      return {
        statusCode: HttpStatus.OK,
        statusText: 'OK',
        message: 'Success',
        data: {links}
      }
    } catch (err) {
      this.profileService.throwServerErr()
    }

  }

  async addLink(addLinkDto: AddLinkDto): Promise<IRes> {

    try {
      const profile = await this.profileService.getProfileByToken(addLinkDto.token);

      if (!profile) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          statusText: 'UNAUTHORIZED',
          message: 'Wrong token'
        }
      }

      const link = {
        name: addLinkDto.name,
        originalLink: addLinkDto.originalLink,
        shortLink: this.profileService.generateToken(16),
        clicks: [],
        created: Date.now(),
        _autorId: profile._id
      }

      const newLink = new this.linkModel(link);
      const savedLink = await newLink.save();

      if (savedLink._id) {
        return {
          statusCode: HttpStatus.CREATED,
          statusText: 'CREATED',
          message: 'Link has been created',
          data: {
            shortLink: newLink.shortLink
          }
        }
      } else {
        return {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          statusText: 'INTERNAL_SERVER_ERROR',
          message: 'Server error'
        }
      }
    } catch (err) {
      this.profileService.throwServerErr()
    }

  }

  async getById(getLinkByIdDto: GetLinkByIdDto): Promise<IRes> {

    try {
      const profile = await this.profileService.getProfileByToken(getLinkByIdDto.token);

      if (!profile) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          statusText: 'UNAUTHORIZED',
          message: 'Wrong token'
        }
      }

      const link = await this.linkModel
        .findOne({
          _id: getLinkByIdDto.id,
          _autorId: profile._id
        })
        .exec();

      if (!link) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          statusText: 'NOT_FOUND',
          message: 'Link not found'
        }
      } else {
        return {
          statusCode: HttpStatus.OK,
          statusText: 'OK',
          message: 'Success',
          data: {link}
        }
      }
    } catch (err) {
      this.profileService.throwServerErr()
    }
  }

  async getByShortName(getLinkByShortNameDto: GetLinkByShortNameDto): Promise<IRes> {

    try {
      const link = await this.linkModel
        .findOne({shortLink: getLinkByShortNameDto.shortLink})
        .exec();

      if (!link) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          statusText: 'NOT_FOUND',
          message: 'Link not found'
        }
      } else {
        const addClickResp = await this.addClick({shortLink: link.shortLink});

        if (addClickResp.statusCode != 200) {
          this.profileService.throwServerErr();
        }

        return {
          statusCode: HttpStatus.OK,
          statusText: 'OK',
          message: 'Success',
          data: {
            originalLink: link.originalLink
          }
        }
      }
    } catch (err) {
      this.profileService.throwServerErr()
    }

  }

  async deleteLink(getLinkByIdDto: GetLinkByIdDto): Promise<IRes> {

    try {
      const profile = await this.profileService.getProfileByToken(getLinkByIdDto.token);

      if (!profile) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          statusText: 'UNAUTHORIZED',
          message: 'Wrong token'
        }
      }

      const deletedLink = await this.linkModel
        .deleteOne({
          _id: getLinkByIdDto.id,
          _autorId: profile._id
        })
        .exec();

        if (!deletedLink) {
          return {
            statusCode: HttpStatus.NOT_FOUND,
            statusText: 'NOT_FOUND',
            message: 'Link not found'
          }
        } else {
          return {
            statusCode: HttpStatus.OK,
            statusText: 'OK',
            message: 'Success'
          }
        }
    } catch (err) {
      this.profileService.throwServerErr()
    }

  }

  async addClick(shortLinkDto: GetLinkByShortNameDto): Promise<IRes> {

    try {
      const link = this.linkModel
        .findOneAndUpdate(
          {shortLink: shortLinkDto.shortLink},
          {$push: {clicks: Date.now()}}
          )
        .exec();
      
      return {
        statusCode: HttpStatus.OK,
        statusText: 'OK',
        message: 'Success'
      }
    } catch (err) {
      this.profileService.throwServerErr()
    }

  }
}