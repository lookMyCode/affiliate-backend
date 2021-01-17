import { HttpStatus } from '@nestjs/common';
import { Document } from 'mongoose';

export interface IProfile extends Document {
  readonly _id?: string,
  readonly email: string,
  readonly password: string,
  readonly token: string,
  readonly created: Date
}

export interface ILink extends Document {
  readonly _id?: string,
  readonly name: string,
  readonly originalLink: string,
  readonly shortLink: string,
  readonly clicks: Date[],
  readonly created: Date,
  readonly _autorId: string
}

export interface IRes {
  statusCode: HttpStatus
  statusText: string
  message?: string
  data?: any
}