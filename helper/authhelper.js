import bycrpt from "bcrypt";
import bgCyan from "colors";

/*Will encrypt password */
const hashPassword = async (password) => {
  try {
    const saltRound = 10;
    const hashedPassword = await bycrpt.hash(password, saltRound);
    return hashedPassword;
  } catch (error) {
    console.log(`Error in Password Encryption ${error}`);
  }
};

/*Compare both normal password and encrypted password */
export const comparePassword = (password, hashedPassword) => {
  return bycrpt.compare(password, hashedPassword);
};

export default hashPassword;
