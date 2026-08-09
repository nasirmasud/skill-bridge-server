import passport from "passport";
import {
  Strategy as GitHubStrategy,
  Profile as GitHubProfile,
} from "passport-github2";
import {
  Strategy as GoogleStrategy,
  Profile as GoogleProfile,
  VerifyCallback as GoogleVerifyCallback,
} from "passport-google-oauth20";
import { env } from "../config/env";
import { loginWithSocial } from "../services/auth/auth.service";

type SocialLogin = (data: {
  provider: "GOOGLE" | "GITHUB";
  socialId: string;
  email?: string | null;
  name: string;
  profileImg?: string | null;
}) => Promise<{ accessToken: string; refreshToken: string }>;

const resolveGoogleProfile = (
  profile: GoogleProfile,
  login: SocialLogin
) => {
  const email = profile.emails?.[0]?.value ?? null;
  const photo = profile.photos?.[0]?.value ?? null;
  return login({
    provider: "GOOGLE",
    socialId: profile.id,
    email,
    name: profile.displayName || email || "Google User",
    profileImg: photo,
  });
};

const resolveGitHubProfile = (
  profile: GitHubProfile,
  login: SocialLogin
) => {
  const email = profile.emails?.[0]?.value ?? null;
  const photo = profile.photos?.[0]?.value ?? null;
  return login({
    provider: "GITHUB",
    socialId: profile.id,
    email,
    name: profile.displayName || profile.username || email || "GitHub User",
    profileImg: photo,
  });
};

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${env.OAUTH_CALLBACK_URL}/google/callback`,
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: GoogleProfile,
        done: GoogleVerifyCallback
      ) => {
        try {
          const result = await resolveGoogleProfile(profile, loginWithSocial);
          done(null, result as unknown as Express.User);
        } catch (error) {
          done(error as Error);
        }
      }
    )
  );
}

if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
        callbackURL: `${env.OAUTH_CALLBACK_URL}/github/callback`,
        scope: ["user:email"],
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: GitHubProfile,
        done: (err?: Error | null | unknown, user?: Express.User | false, info?: object) => void
      ) => {
        try {
          const result = await resolveGitHubProfile(profile, loginWithSocial);
          done(null, result as unknown as Express.User);
        } catch (error) {
          done(error as Error);
        }
      }
    )
  );
}

export default passport;
