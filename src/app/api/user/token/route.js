import jwt from 'jsonwebtoken';
const verifyToken = async (req, res) => {

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {

        const { token } = req.cookies;
        if (token === undefined || token === null) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const verify = await jwt.verify(token, "secretKeyanyRandomString");
        if (verify) {
            res.status(200).json({ message: "Token verified!", verify });
        } else {
            return res.status(401).json({ message: 'Unauthorized' });
        }

    } catch (error) {
        console.log(error);
    }
}
export default verifyToken;