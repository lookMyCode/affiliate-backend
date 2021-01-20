import { GetLinkByIdDto } from './../../dto/get-link-by-id.dto';
import { AddLinkDto } from './../../dto/add-link.dto';
import { IRes } from './../../interfaces';
import { LinkService } from './link.service';
import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { TokenDto } from 'src/dto/token.dto';
import { Response } from 'express';
import { GetLinkByShortNameDto } from 'src/dto/getLinkByShortName.dto';

@Controller('link')
export class LinkController {

  constructor(
    private linkService: LinkService
  ) {}

  @Post('getAll')
  async getAll(@Res() res: Response, @Body() tokenDto: TokenDto) {
    if (!tokenDto.token) return res.status(HttpStatus.PRECONDITION_FAILED).json({
      statusCode: HttpStatus.PRECONDITION_FAILED,
      statusText: 'PRECONDITION_FAILED',
      message: 'Token is required'
    });

    const response: IRes = await this.linkService.getAll(tokenDto);
    return res.status(response.statusCode).json(response);
  }

  @Post('getById')
  async getById(@Res() res: Response, @Body() getLinkByIdDto: GetLinkByIdDto) {
    if (!getLinkByIdDto.token || !getLinkByIdDto.id) return res.status(HttpStatus.PRECONDITION_FAILED).json({
      statusCode: HttpStatus.PRECONDITION_FAILED,
      statusText: 'PRECONDITION_FAILED',
      message: 'Token, original link and name are required'
    });

    const response: IRes = await this.linkService.getById(getLinkByIdDto);
    return res.status(response.statusCode).json(response);
  }

  @Post('getByShortName')
  async getByShortName(@Res() res: Response, @Body() getLinkByShortNameDto: GetLinkByShortNameDto) {
    if (!getLinkByShortNameDto.shortLink) return res.status(HttpStatus.PRECONDITION_FAILED).json({
      statusCode: HttpStatus.PRECONDITION_FAILED,
      statusText: 'PRECONDITION_FAILED',
      message: 'Short link is required'
    });

    const response: IRes = await this.linkService.getByShortName(getLinkByShortNameDto);
    return res.status(response.statusCode).json(response);
  }

  @Post('add')
  async addLink(@Res() res: Response, @Body() addLinkDto: AddLinkDto) {
    if (!addLinkDto.token || !addLinkDto.originalLink || !addLinkDto.name) return res.status(HttpStatus.PRECONDITION_FAILED).json({
      statusCode: HttpStatus.PRECONDITION_FAILED,
      statusText: 'PRECONDITION_FAILED',
      message: 'Token, original link and name are required'
    });

    const response: IRes = await this.linkService.addLink(addLinkDto);
    return res.status(response.statusCode).json(response);
  }

  @Post('addClick')
  async addClick(@Res() res: Response, @Body() shortLinkDto: GetLinkByShortNameDto) {
    if (!shortLinkDto.shortLink) return res.status(HttpStatus.PRECONDITION_FAILED).json({
      statusCode: HttpStatus.PRECONDITION_FAILED,
      statusText: 'PRECONDITION_FAILED',
      message: 'Id is required'
    });

    const response: IRes = await this.linkService.addClick(shortLinkDto);
    return res.status(response.statusCode).json(response);
  }

  @Post('delete')
  async deleteLink(@Res() res: Response, @Body() getLinkByIdDto: GetLinkByIdDto) {
    if (!getLinkByIdDto.token || !getLinkByIdDto.id) return res.status(HttpStatus.PRECONDITION_FAILED).json({
      statusCode: HttpStatus.PRECONDITION_FAILED,
      statusText: 'PRECONDITION_FAILED',
      message: 'Token and id are required'
    });

    const response: IRes = await this.linkService.deleteLink(getLinkByIdDto);
    return res.status(response.statusCode).json(response);
  }
}
