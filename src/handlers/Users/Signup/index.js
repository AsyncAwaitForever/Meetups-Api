import middy from "@middy/core";
import { signupUser } from "../../../services/userService";
import { sendError, sendSuccessResponse } from "../../../utils/apiResponses";
import { validateSignup } from "../../../utils/validateSignup";

const signupHandler = async (event) => {
    try {
        const { username, password, email } = JSON.parse(event.body)
    
        validateSignup(email, password, username)
    
        const user = await signupUser(email, username, password)

        return sendSuccessResponse(201, {
            message: `User with email: ${user.email} created successfully`,
        })
    
    } catch (error) {
        if (error.message.includes("User with e-mail")) {
            return sendError(409, "This e-mail is already registered")
        }
        if (error.message.includes("Database error"))  {
         return sendError(500,"Database error, failed to create user")
        }
        return sendError(500, "Internal server error")
    }

}

export const handler = middy(signupHandler)

  