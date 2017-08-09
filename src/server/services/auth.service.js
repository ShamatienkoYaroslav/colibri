import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';

import User from '../modules/users/model';
import { constants } from '../config';

// Local strategy
const localOpts = {
  usernameField: 'user',
};

const localStrategy = new LocalStrategy(localOpts, (name, password, done) => {
  try {
    const user = User.findByName(name).value();
    if (!user) {
      return done(null, false);
    } else if (!User.authenticateUser(user, password)) {
      return done(null, false);
    }
    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
});

// Jwt strategy
const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeader('authorization'),
  secretOrKey: constants.JWT_SECRET,
};

const jwtStrategy = new JWTStrategy(jwtOpts, (payload, done) => {
  try {
    const user = User.findById(payload.id).value();

    if (!user) {
      return done(null, false);
    }

    return done(null, user);
  } catch (e) {
    return done(e, false);
  }
});

passport.use(localStrategy);
passport.use(jwtStrategy);

export const authLocal = passport.authenticate('local', { session: false });
export const authJwt = passport.authenticate('jwt', { session: false });
