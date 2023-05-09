const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

var secret = speakeasy.generateSecret({
    name: "WeAreDevs"
})

console.log(secret)
qrcode.toDataURL(secret.otpauth_url, function(err, data){
    console.log(data)
})


//___________________________//

const express = require ('express')
const app = express()
app.get('/api', (req, res) => res.json({ message: 'Welcome 2FA example'}))
const PORT = 5000
app.listen(PORT, () => console.log('Server running on port 5000'))