const express = require("express");
const passport = require("passport");
const session = require("express-session");
const { Strategy } = require("passport-discord");

const app = express();
const port = 3000;

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const strategy = new Strategy(
	{
		clientID: "BOT_CLIENT_ID",
		clientSecret: "BOT_SECRET",
		callbackURL: `http://localhost:${port}/callback`,
		scope: ["identify"],
	},
	(_access_token, _refresh_token, user, done) =>
		process.nextTick(() => done(null, user)),
);

passport.use(strategy);

app.use(
	session({
		secret: "secret",
		resave: false,
		saveUninitialized: false,
	}),
);

app.use(passport.session());
app.use(passport.initialize());
app.get("/giris",passport.authenticate("discord", {scope: ["identify"],}));
app.get("/callback", passport.authenticate("discord", {failureRedirect: "/hata",}),(_req, res) => res.redirect("/"));
app.get("/", (req, res) => {res.send(req.user ? `${req.user.username}` : "Giriş Yapın!")});

const listener = app.listen(port, "0.0.0.0", () => {
	console.log(`Site Aktif! Port: ${listener.address().port}`);
});
