function replaceUndefinedWithNull(obj) {
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            if (obj[key] === undefined) {
                obj[key] = null;
            } else if (typeof obj[key] === "object" && obj[key] !== null) {
                replaceUndefinedWithNull(obj[key]);
            }
        }
    }
}

module.exports = (obj) => {
    replaceUndefinedWithNull(obj);
}

