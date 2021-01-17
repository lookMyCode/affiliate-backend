import { DeleteProfileDto } from './../../dto/delete-profile.dto';
import { ChangePassDto } from './../../dto/change-pass.dto';
import { IRes } from './../../interfaces';
import { ChangeLoginDto } from './../../dto/change-login.dto';
import { CreateProfileDto } from './../../dto/create-profile.dto';
import { ProfileService } from './profile.service';
import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Patch, Post, Res } from '@nestjs/common';
import { Response, Request } from 'express';

@Controller('profile')
export class ProfileController {

  constructor (
    private profileService: ProfileService
  ) {}

  @Get()
  async login(@Res() res: Response, @Body() createProfileDto: CreateProfileDto) {
    if (!createProfileDto.email || !createProfileDto.password) return res.status(HttpStatus.PRECONDITION_FAILED).json({
      statusCode: HttpStatus.PRECONDITION_FAILED,
      statusText: 'PRECONDITION_FAILED',
      message: 'Email and password are required'
    });

    const response: IRes = await this.profileService.getToken(createProfileDto);
    return res.status(response.statusCode).json(response);
  }

  @Post()
  async register(@Res() res: Response, @Body() createProfileDto: CreateProfileDto) {
    if (!createProfileDto.email || !createProfileDto.password) return res.status(HttpStatus.PRECONDITION_FAILED).json({
      statusCode: HttpStatus.PRECONDITION_FAILED,
      statusText: 'PRECONDITION_FAILED',
      message: 'Email and password are required'
    });

    const response: IRes = await this.profileService.register(createProfileDto);
    return res.status(response.statusCode).json(response);
  }

  @Patch('email')
  async changeEmail(@Res() res: Response, @Body() changeLoginDto: ChangeLoginDto) {
    if (!changeLoginDto.email || !changeLoginDto.token) return res.status(HttpStatus.PRECONDITION_FAILED).json({
      statusCode: HttpStatus.PRECONDITION_FAILED,
      statusText: 'PRECONDITION_FAILED',
      message: 'Token and new email are required'
    });

    const response: IRes = await this.profileService.changeLogin(changeLoginDto);
    return res.status(response.statusCode).json(response);
  }

  @Patch('password')
  async changePass(@Res() res: Response, @Body() changePassDto: ChangePassDto) {
    if (!changePassDto.token || !changePassDto.oldPassword || !changePassDto.newPassword) return res.status(HttpStatus.PRECONDITION_FAILED).json({
      statusCode: HttpStatus.PRECONDITION_FAILED,
      statusText: 'PRECONDITION_FAILED',
      message: 'Token, old and new passwords are required'
    });

    const response = await this.profileService.changePass(changePassDto);
    return res.status(response.statusCode).json(response);
  }

  @Delete()
  async deleteProfile(@Res() res: Response, @Body() deleteProfileDto: DeleteProfileDto) {
    if (!deleteProfileDto.token || !deleteProfileDto.password) return res.status(HttpStatus.PRECONDITION_FAILED).json({
      statusCode: HttpStatus.PRECONDITION_FAILED,
      statusText: 'PRECONDITION_FAILED',
      message: 'Token and new passwords are required'
    });

    const response = await this.profileService.deleteProfile(deleteProfileDto);
    return res.status(response.statusCode).json(response);
  }
}
