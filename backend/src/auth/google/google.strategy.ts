import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { GOOGLE_CLIENT_ID, GOOGLE_SECRET, GOOGLE_REDIRECT_URI } from "src/common/constants";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_SECRET,
      callbackURL: GOOGLE_REDIRECT_URI,
      scope: ["email", "profile"],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
    const { name, emails } = profile;
    const user = {
      email: emails && emails.length > 0 ? emails[0].value : "",
      name: profile.displayName,
      accessToken,
    };
    done(null, user);
  }
}
