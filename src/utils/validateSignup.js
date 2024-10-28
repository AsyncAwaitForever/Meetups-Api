export const validateSignup = (email, password, username) => {
    
    if (!email || !password || !username) {
        throw new Error("Email, password, and username are all required fields");
    }

    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordRegex = /^.{5,}$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
    }

    if (!passwordRegex.test(password)) {
        throw new Error("Password must be at least 5 characters long");
    }

    if (!usernameRegex.test(username)) {
        throw new Error("Username must be between 3 and 20 characters and can contain letters, numbers, and underscores.");
    }

};
