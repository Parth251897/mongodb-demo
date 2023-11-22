
const { JWT_SECRET } = process.env;

const jwtResponse = async function jwtResponse() {
  try {
    jwt.verify(token, JWT_SECRET, (error, decoded) => {
      if (error) {
        return res.status(401).json({
          status: 401,
          message: "invalied or expired token",
        });
      }
    });
  } catch (error) {
    console.log("Error encrypting password:", error);
    throw error;
  }
};
module.exports = jwtResponse;