# Affiliate link

## Usage

All queries must have params in the body and returns response like it:
`{
  statusCode: 200,
  statusText: 'OK',
  message: 'Success',
  data: {...}
}`

## Registration

`POST: /profile/register`
Require params:
`{
  email: 'string',
  password: 'string'
}`

Return token

## Login

`POST: /profile/login`
Require params:
`{
  email: 'string',
  password: 'string'
}`

Return token

## Change email

`POST: /profile/email`
Require params:
`{
  email: 'string',
  token: 'string'
}`

WARNING! Will return new token

## Change password

`POST: /profile/password`
Require params:
`{
  token: 'string',
  oldPassword: 'string',
  newPassword: 'string'
}`

WARNING! Will return new token

## Delete profile

`POST: /profile/delete`
Require params:
`{
  token: 'string',
  password: 'string'
}`

WARNING! Will delete all links and this login

## Get all links

`POST: /link/getAll`
Require params:
`{
  token: 'string'
}`

Return all links for this user

## Get link by id

`POST: /link/getById`
Require params:
`{
  token: 'string',
  id: 'string'
}`

Return link by id if token is valid

## Get link by shortname

`POST: /link/getByShortName`
Require params:
`{
  shortLink: 'string'
}`

Return original link by shortname and add click-event

## Add link

`POST: /link/add`
Require params:
`{
  token: 'string',
  originalLink: 'string',
  name: 'string'
}`

## Add click-event

`POST: /link/addClick`
Require params:
`{
  shortLink: 'string'
}`

## Delete link

`POST: /link/delete`
Require params:
`{
  token: 'string',
  id: 'string'
}`