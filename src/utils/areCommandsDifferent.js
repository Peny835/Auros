function normalize(value) {
    if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
        return null;
    }
    return value;
}

function isFalsy(value) {
    return value === undefined || value === null || value === false;
}

function areOptionsDifferent(optionsA, optionsB) {
    if (normalize(optionsA) == null && normalize(optionsB) == null) {
        return false;
    }
    if (normalize(optionsA) == null || normalize(optionsB) == null) {
        return true;
    }
    if (optionsA.length !== optionsB.length) {
        console.log(`Different options length: ${optionsA.length} !== ${optionsB.length}`);
        return true;
    }

    const standardize = (value) => value === undefined || value === null ? null : value;

    for (let i = 0; i < optionsA.length; i++) {
        const optA = optionsA[i];
        const optB = optionsB[i];

        if (optA.name !== optB.name) {
            console.log(`Different option name: ${optA.name} !== ${optB.name}`);
            return true;
        }
        if (optA.description !== optB.description) {
            console.log(`Different option description: ${optA.description} !== ${optB.description}`);
            return true;
        }
        if (isFalsy(optA.required) !== isFalsy(optB.required)) {
            console.log(`Different option required: ${optA.required} !== ${optB.required}`);
            return true;
        }

        // Standardize min_value and max_value before comparison
        if (standardize(optA.min_value) !== standardize(optB.min_value)) {
            console.log(`Different option min_value: ${standardize(optA.min_value)} !== ${standardize(optB.min_value)}`);
            return true;
        }
        if (standardize(optA.max_value) !== standardize(optB.max_value)) {
            console.log(`Different option max_value: ${standardize(optA.max_value)} !== ${standardize(optB.max_value)}`);
            return true;
        }

        // Standardize min_length and max_length before comparison
        if (standardize(optA.min_length) !== standardize(optB.min_length)) {
            console.log(`Different option min_length: ${standardize(optA.min_length)} !== ${standardize(optB.min_length)}`);
            return true;
        }
        if (standardize(optA.max_length) !== standardize(optB.max_length)) {
            console.log(`Different option max_length: ${standardize(optA.max_length)} !== ${standardize(optB.max_length)}`);
            return true;
        }

        if (optA.type !== optB.type) {
            console.log(`Different option type: ${optA.type} !== ${optB.type}`);
            return true;
        }

        // Compare choices
        if (normalize(optA.choices) || normalize(optB.choices)) {
            if (normalize(optA.choices) == null || normalize(optB.choices) == null || optA.choices.length !== optB.choices.length) {
                console.log(`Different option choices`);
                return true;
            }
            for (let j = 0; j < optA.choices.length; j++) {
                if (optA.choices[j].name !== optB.choices[j].name || optA.choices[j].value !== optB.choices[j].value) {
                    console.log(`Different choice: ${optA.choices[j].name} !== ${optB.choices[j].name}`);
                    return true;
                }
            }
        }

        // Recursively compare nested options
        if (areOptionsDifferent(optA.options, optB.options)) {
            return true;
        }
    }

    return false;
}




module.exports = (applicationCommands, localCommands) => {
    if (applicationCommands.name !== localCommands.data.name) {
        console.log(`Different name: ${applicationCommands.name} !== ${localCommands.data.name}`);
        return true;
    }
    if (applicationCommands.description !== localCommands.data.description) {
        console.log(`Different description: ${applicationCommands.description} !== ${localCommands.data.description}`);
        return true;
    }
    if (isFalsy(applicationCommands.nsfw) !== isFalsy(localCommands.data.nsfw)) {
        console.log(`Different nsfw: ${applicationCommands.nsfw} !== ${localCommands.data.nsfw}`);
        return true;
    }

    // Compare options
    return areOptionsDifferent(applicationCommands.options, localCommands.data.options);
};