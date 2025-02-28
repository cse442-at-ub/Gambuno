let excludeChars = [
    '"', "'", '*', '+', ',', '.', '/',
    ':', ';', '<', '>', '?', '[', '\\', ']',
    '`', '{', '|', '}', '~',
    ' ', "\n", "\t", "\r", "\f", "\v"
];

let includeChars = ['!', '@', '#', '$', '%', '^', '&', '(', ')', '-', '_', '='];

function pass_length(password){
    if (password.length < 8) {
        return { valid: false, message: "Password must be at least 8 characters long. \n" };
    }
    return true;
}

function user_length(username){
    if (username.length < 8) {
        return { valid: false, message: "Username must be at least 8 characters long. \n" };
    }
    return true;
}

function pass_upper(password){
    let containsUpper = false;
    for (let i = 0; i < password.length; i++) {
        let char = password[i];
        if (char >= 'A' && char <= 'Z') containsUpper = true;
    }
    if (!containsUpper) return { valid: false, message: "Password must contain at least one uppercase letter. \n" };
    return true;
}

function pass_lower(password){
    let containsLower = false;
    for (let i = 0; i < password.length; i++) {
        let char = password[i];
        if (char >= 'a' && char <= 'z') containsLower = true;
    }
    if (!containsLower) return { valid: false, message: "Password must contain at least one lowercase letter. \n" };
    return true;
}

function pass_number(password){
    let containsNumber = false;
    for (let i = 0; i < password.length; i++) {
        let char = password[i];
        if (char >= '0' && char <= '9') containsNumber = true;
    }
    if (!containsNumber) return { valid: false, message: "Password must contain at least one number. \n" };
    return true;
}

function pass_special(password){
    let containsSpecial = false;
    for (let i = 0; i < password.length; i++) {
        let char = password[i];
        if (excludeChars.includes(char)) {
            return { valid: false, message: `Password contains a restricted character: ${char} \n` }
            };
        if (includeChars.includes(char)) containsSpecial = true;
    }
    if (!containsSpecial) return { valid: false, message: "Password must contain at least one special character. \n"};
    return true;
}


export function isValidPassword(username, password) {
    let errors = [];
    if (user_length(username) !== true) errors.push(user_length(username)["message"]);
    if(pass_length(password) !== true) errors.push(pass_length(password)["message"]);
    if(pass_special(password) !== true) errors.push(pass_special(password)["message"]);
    if(pass_upper(password) !== true) errors.push(pass_upper(password)["message"]);;
    if(pass_lower(password) !== true) errors.push(pass_lower(password)["message"]);;
    if(pass_number(password) !== true) errors.push(pass_number(password)["message"]);;

    if(user_length(username) === true && pass_length(password) === true && pass_special(password) === true && pass_upper(password) === true && pass_lower(password) === true && pass_number(password) === true) return { valid: true, message: "Password is valid." };
    return { valid: false, message: errors.join("")};
    
}

const user = "Kurian"
const pass = "TestNumber123/!";
console.log(isValidPassword(user, pass));

