export const validateLogin = (email, password) => {
    
    if (!email || !password) {
        throw new Error("Email and password are both required fields");
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordRegex = /^.{5,}$/;

    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
    }

    if (!passwordRegex.test(password)) {
        throw new Error("Password must be at least 5 characters long");
    }

};