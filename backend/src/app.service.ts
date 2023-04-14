import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  
  googleLogin(req: any){
    if (req.user){
      const user = req.user;
      //console.log(user);
      const email = user.emails ? user.emails[0].value : null;
      const firstName = user.name ? user.name.givenName : null;
      const lastName = user.name ? user.name.familyName : null;

      //console.log(email);
      //console.log(firstName);
      //console.log(lastName);
      if (email && firstName && lastName) {
        return {
          message: "User info from Google",
          user: {
            email: email,
            firstName: firstName,
            lastName: lastName
          }
        };
      }
    }
    return "No user from google";
  }
}