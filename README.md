# Affiliate link

## Usage

All queries get params in the body and returns response like it:
`{
  statusCode: 200,
  statusText: 'OK',
  message: 'Success',
  data: {...}
}`

## Registration

`POST: /profile`
Require params:
`{
  email: 'string',
  password: 'string'
}`

Return token

## Login

`GET: /profile`
Require params:
`{
  email: 'string',
  password: 'string'
}`

Return token

## Change email

`PATCH: /profile/email`
Require params:
`{
  email: 'string',
  token: 'string'
}`

WARNING! Will return new token

## Change password

`PATCH: /profile/password`
Require params:
`{
  token: 'string',
  oldPassword: 'string',
  newPassword: 'string'
}`

WARNING! Will return new token

## Delete profile

`DELETE: /profile`
Require params:
`{
  token: 'string',
  password: 'string'
}`

WARNING! Will delete all links and this logon

## Get all links

`GET: /link`
Require params:
`{
  token: 'string'
}`

Return all links for this user

## Get link by id

`GET: /link/getById`
Require params:
`{
  token: 'string',
  id: 'string'
}`

Return link by id if token is valid

## Get link by shortname

`GET: /link/getByShortName`
Require params:
`{
  shortLink: 'string'
}`

Return original link by shortname and add click-event

## Add link

`POST: /link`
Require params:
`{
  token: 'string',
  originalLink: 'string',
  name: 'string'
}`

## Add click-event

`PATCH: /link`
Require params:
`{
  shortLink: 'string'
}`

## Delete link

`DELETE: /link`
Require params:
`{
  token: 'string',
  id: 'string'
}`