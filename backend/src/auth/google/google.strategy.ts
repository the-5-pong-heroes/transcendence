import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";

@Injectable()

export class GoogleStrategy extends PassportStrategy(Strategy, "google"){
    constructor(){
        super({
            clientID : "710896193743-ghevbabaa9s9f94qlsaqbvbrnlj30hgv.apps.googleusercontent.com",
            clientSecret: "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",
            callbackURL: "http://localhost:3333/auth/google/callback",
            scope: ["email", "profile"]
        });
    }
    async validate(accessToken: string, refreshToken: string, profile: any, done:
         VerifyCallback): Promise<any>{
            //console.log("Access token:", accessToken);
            //console.log("Profile:", profile);

            const {name, emails, photos} = profile
            const user = {
                email: (emails && emails.length > 0) ? emails[0].value : '',                firstName: name.givenName,
                lastName: name.familyName,
                picture: (photos && photos.length > 0) ? photos[0].value : '',
                accessToken
            }
            
            done(null, user);
         }
}