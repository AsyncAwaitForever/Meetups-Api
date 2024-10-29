import middy from "@middy/core";
import { loginUser } from "../../../services/userService";
import { sendError, sendSuccessResponse } from "../../../utils/apiResponses";
import { validateLogin } from "../../../utils/validateSignup";

const loginHandler = async (event) => {
    try {
        const { password, email } = JSON.parse(event.body)
    
        validateLogin(email, password)
    
        const data = await loginUser(email , password)

        return sendSuccessResponse(200, {
            token: data.token,
            userId: data.user
        })
    
    } catch (error) {
    if (
      error.message === "User not found" ||
      error.message === "Invalid password"
    ) {
      return sendError(401, "Invalid credentials");
    }
    return sendError(500, "Internal server error")
    }

}

export const handler = middy(loginHandler)
