const passport = require('passport');
const { Strategy } = require('passport-local');
const User = require('app/models/user.model');
const passwordUtil = require('app/utils/password.util');

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
	'local.register',
	new Strategy({ usernameField: 'email', passReqToCallback: true }, async (req, email, password, done) => {
		try {
			const foundedUser = await User.findOne({ email }).lean();
			if (foundedUser) {
				return done(null, false, req.flash('error', 'چنین کاربری در سایت قبلا ثبت نام کرده است'));
			}

			const newUser = await User.create({
				email,
				password: await passwordUtil.hash(password),
			});
			return done(null, newUser);
		} catch (error) {
			done(error, false, req.flash('error', 'ثبت نام با موفقیت انجام نشد. لطفا دوباره سعی کنید'));
		}
	})
);

passport.use(
	'local.login',
	new Strategy({ usernameField: 'email', passReqToCallback: true }, async (req, email, password, done) => {
		try {
			const foundedUser = await User.findOne({ email });
			console.log('compare', await passwordUtil.compare(password, foundedUser.password));
			if (!foundedUser || !(await passwordUtil.compare(password, foundedUser.password)))
				return done(null, false, req.flash('error', 'اطلاعات وارد شده صحیح نمیباشد'));
			done(null, foundedUser);
		} catch (error) {
			done(error, false, req.flash('error', 'ورود به حساب کاربری با موفقیت انجام نشد لطفا دوباره سعی کنید'));
		}
	})
);
