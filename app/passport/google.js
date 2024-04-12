const passport = require('passport');
const Strategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('app/models/user.model');

passport.serializeUser((user, done) => {
	done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id);
		if (user) done(null, user);
	} catch (error) {
		done(error, false);
	}
});

passport.use(
	'google',
	new Strategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_SECRET_KEY,
			callbackURL: process.env.GOOGLE_CALLBACK_URL,
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				const foundUser = await User.findOne({ email: profile.emails[0].value });
				if (foundUser) {
					return done(null, foundUser);
				}
				const newUser = new User({
					name: profile.displayName,
					email: profile.emails[0].value,
					password: profile.id,
					photo: profile?.photos[0]?.value,
				});
				await newUser.save();
				return done(null, newUser);
			} catch (error) {
				done(error);
			}
		}
	)
);
