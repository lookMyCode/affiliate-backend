import { DeleteProfileDto } from './../../dto/delete-profile.dto';
import { ILink, IRes } from './../../interfaces';
import { ChangeLoginDto } from './../../dto/change-login.dto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { IProfile } from '../../interfaces';
import { CreateProfileDto } from 'src/dto/create-profile.dto';
import { ChangePassDto } from 'src/dto/change-pass.dto';

@Injectable()
export class ProfileService {
  private symbols: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];

  constructor(
    @InjectModel('Profile') private readonly profileModel: Model<IProfile>,
    @InjectModel('Link') private readonly linkModel: Model<ILink>
  ) {}

  async getToken(createProfileDto: CreateProfileDto): Promise<IRes> {

    try {
      const profile = await this.profileModel
        .findOne({email: createProfileDto.email})
        .exec();

      if (!profile) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          statusText: 'UNAUTHORIZED',
          message: 'Wrong email or password'
        }
      }

      const isRightPass = await this.checkPass(createProfileDto.password, profile.password);

      if (isRightPass) {
        return {
          statusCode: HttpStatus.OK,
          statusText: 'OK',
          message: 'Success',
          data: {
            token: profile.token
          }
        }
      } else {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          statusText: 'UNAUTHORIZED',
          message: 'Wrong email or password'
        }
      }
    } catch (err) {
      this.throwServerErr()
    }

  }

  async register(createProfileDto: CreateProfileDto): Promise<IRes> {

    try {
      if ( !this.validateMail(createProfileDto.email) ) {
        return {
          statusCode: HttpStatus.PRECONDITION_FAILED,
          statusText: 'PRECONDITION_FAILED',
          message: 'Invalid email'
        }
      }
  
      if (createProfileDto.password.length < 6) {
        return {
          statusCode: HttpStatus.PRECONDITION_FAILED,
          statusText: 'PRECONDITION_FAILED',
          message: 'Password length is less then 6'
        }
      }
  
      const isBusy: boolean = await this.isBusyEmail(createProfileDto.email);
  
      if (isBusy) {
        return {
          statusCode: HttpStatus.FORBIDDEN,
          statusText: 'FORBIDDEN',
          message: 'Email is busy'
        }
      }
  
      const hash: string = await this.getHash(createProfileDto.password);
      const token: string = this.generateToken();
  
      const profile = {
        email: createProfileDto.email,
        password: hash,
        token,
        created: Date.now()
      }
  
      const newProfile = new this.profileModel(profile);
      const savedProfile = await newProfile.save();
  
      if (savedProfile._id) {
        return {
          statusCode: HttpStatus.CREATED,
          statusText: 'CREATED',
          message: 'Profile has been created',
          data: {token}
        }
      } else {
        return this.throwServerErr();
      }
    } catch (err) {
      this.throwServerErr()
    }

  }

  async changeLogin(changeLoginDto: ChangeLoginDto): Promise<any> {

    try {
      const profile = await this.profileModel
        .findOne({token: changeLoginDto.token})
        .exec();

      if (!profile) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          statusText: 'UNAUTHORIZED',
          message: 'Wrong token'
        }
      }

      const isRightPass = await this.checkPass(changeLoginDto.password, profile.password);

      if(!isRightPass) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          statusText: 'UNAUTHORIZED',
          message: 'Wrong old password'
        }
      }

      const isBusy: boolean = await this.isBusyEmail(changeLoginDto.email);

      if (isBusy) {
        return {
          statusCode: HttpStatus.FORBIDDEN,
          statusText: 'FORBIDDEN',
          message: 'Email is busy'
        }
      }

      const token = this.generateToken();

      const updatedProfile = await this.profileModel
        .findByIdAndUpdate(profile._id, {
          email: changeLoginDto.email,
          token: token
        })
        .exec();

      if (updatedProfile) {
        return {
          statusCode: HttpStatus.OK,
          statusText: 'OK',
          message: 'Email has been changed',
          data: {token}
        };
      } else {
        return this.throwServerErr();
      }
    } catch (err) {
      this.throwServerErr()
    }

  }

  async changePass(changePassDto: ChangePassDto) {

    try {
      const profile = await this.profileModel
        .findOne({token: changePassDto.token})
        .exec();

      if (!profile) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          statusText: 'UNAUTHORIZED',
          message: 'Wrong token'
        }
      }

      if (changePassDto.newPassword.length < 6) {
        return {
          statusCode: HttpStatus.PRECONDITION_FAILED,
          statusText: 'PRECONDITION_FAILED',
          message: 'Password length is less then 6'
        }
      }

      const isRightPass = await this.checkPass(changePassDto.oldPassword, profile.password);

      if(!isRightPass) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          statusText: 'UNAUTHORIZED',
          message: 'Wrong old password'
        }
      }

      const newPass = await this.getHash(changePassDto.newPassword);
      const token = this.generateToken();

      const updatedProfile = await this.profileModel
        .findByIdAndUpdate(profile._id, {
          password: newPass,
          token
        })
        .exec();

      if (updatedProfile) {
        return {
          statusCode: HttpStatus.OK,
          statusText: 'OK',
          message: 'Password has been changed',
          data: {token}
        }
      } else {
        return this.throwServerErr();
      }
    } catch (err) {
      this.throwServerErr()
    }

  }

  async deleteProfile(deleteProfileDto: DeleteProfileDto): Promise<IRes> {

    try {
      const profile = await this.profileModel
        .findOne({token: deleteProfileDto.token})
        .exec();

      if (!profile) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          statusText: 'UNAUTHORIZED',
          message: 'Wrong token'
        }
      }

      const isRightPass = await this.checkPass(deleteProfileDto.password, profile.password)

      if(!isRightPass) {
        return {
          statusCode: HttpStatus.UNAUTHORIZED,
          statusText: 'UNAUTHORIZED',
          message: 'Wrong password'
        }
      }

      await this.linkModel
        .deleteMany({_autorId: profile._id})
        .exec();

      const deletedProfile = await this.profileModel
        .deleteOne({_id: profile._id})
        .exec();

      if (deletedProfile) {
        return {
          statusCode: HttpStatus.OK,
          statusText: 'OK',
          message: 'Profile has been deleted'
        }
      } else {
        return this.throwServerErr();
      }
    } catch (err) {
      this.throwServerErr()
    }

  }

  private async getHash(pass): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(pass, salt);
    
    return hash;
  }

  private async checkPass(pass, hash): Promise<boolean> {
    const isMatch: boolean = await bcrypt.compare(pass, hash);
    return isMatch;
  }

  public generateToken(len: number = 64): string {
    let token: string = '';

    for (let i = 0; i < len; i++) {
      token += this.symbols[this.getRandomInt(0, this.symbols.length)]
    }

    return token;
  }

  private getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  private validateMail(email: string): boolean {
    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return reg.test(email);
 }

  private async isBusyEmail(email: string): Promise<boolean> {
    const isBusy = await this.profileModel
      .findOne({email})
      .exec();

    return !!isBusy;
  }

  public async getProfileByToken(token: string): Promise<IProfile> {
    const profile: IProfile = await this.profileModel
      .findOne({token})
      .exec();

    return profile;
  }

  public throwServerErr() {
    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      statusText: 'INTERNAL_SERVER_ERROR',
      message: 'Server error'
    }
  }
}