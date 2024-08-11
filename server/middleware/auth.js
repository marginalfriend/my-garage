import jwt from 'jsonwebtoken';


const { verify } = jwt

export const authenticateToken = (req, res, next) => {
	const token = req.headers['authorization'];
	if (!token) return res.sendStatus(401);

	verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
}
