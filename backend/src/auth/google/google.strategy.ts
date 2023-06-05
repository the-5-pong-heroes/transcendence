import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      clientID: "710896193743-ghevbabaa9s9f94qlsaqbvbrnlj30hgv.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3333/auth/google/callback",
      scope: ["email", "profile"],
    });
  }
  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
    console.log("Access token:", accessToken);
    console.log("Refresh token:", refreshToken);
    console.log("Profile:", profile);

    const { name, emails } = profile;
    const user = {
      email: emails && emails.length > 0 ? emails[0].value : "",
      displayName: profile.displayName,
      accessToken,
    };
    done(null, user);
  }
}
