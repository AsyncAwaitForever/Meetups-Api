import { verifyToken } from "../utils/jwtUtils";

const validateToken = {
    before: async (request) => {
        try {
            const token = request.event.headers.authorization?.replace('Bearer ', '');
            
            if (!token) {
                throw new Error('No token provided');
            }

            const data = verifyToken(token); 
            request.event.userId = data.userId;
        } catch (error) {
            console.error("Token validation error:", error); 
            throw new Error("Unauthorized");
        }
    },
    onError: async (request) => {
        request.response = {
            statusCode: 401,
            body: JSON.stringify({ message: "Unauthorized" }),
        };
        return request.response;
    }
};

export default validateToken