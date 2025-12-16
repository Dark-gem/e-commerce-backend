import jwt from "jsonwebtoken";

export const authmiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "no token received" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = decoded; //req.user takes value from decoded
    console.log(req.user);
    next();
  } catch (error) {
    return res.status(401).json({ message: "token is invalid" });
  }
};
