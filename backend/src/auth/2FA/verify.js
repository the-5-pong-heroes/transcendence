const speakeasy = require('speakeasy');

var verified = speakeasy.totp.verify({
    secret: '',
    encoding: 'ascii',
    token: '000000'
})

console.log(verified);