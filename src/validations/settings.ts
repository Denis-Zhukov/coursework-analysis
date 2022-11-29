export const general = {
    limit: {
        min: 1, maxDefault: 10,
    },
};

export const client = {
    username: {
        regex: /^[A-Za-z][A-Za-z0-9_]+$/, error: `'username' must include only latin letters, numbers or symbol '_'
'username' must start with letter`, minLength: 3, maxLength: 255,
    },

    password: {
        regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&~_])[A-Za-z\d@$!%*?&~_]+$/, error: `
'password' must be include at least 1 latin capital letter, lowercase letter, special symbol(@$!%*?&~_) and digit
'password' can include letters, special symbols(@$!%*?&~_) and digits`, minLength: 8, maxLength: 255,
    },

    varchar: {
        minLength: 1, maxLength: 255,
    },

    text: {
        minLength: 1, maxLength: 1000,
    },

    contactDetails: {
        minLength: 1, maxLength: 500,
    },
};

export const shop = {
    varchar: {
        minLength: 1,
        maxLength: 255,
    },

    text: {
        minLength: 1,
        maxLength: 1000,
    }
}

export const category = {
    varchar: {
        minLength: 1, maxLength: 255,
    },
};

export const product = {
    description: {
        minLength: 1, maxLength: 3000,
    },

    categories: {
        minElements: 1, maxElements: 10,
    },

    varchar: {
        minLength: 1, maxLength: 255,
    },
};

export const addresses = {
    varchar: {
        minLength: 1,
        maxLength: 255,
    },
    text: {
        minLength: 1,
        maxLength: 1000,
    }
}