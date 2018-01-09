convertDate = function (v) {
    return v.slice(0, 10);
}

convertBoolean = function (t) {
    if (t === 'true') {
        return 1;
    } else if (t === 'false') {
        return 0;
    }
}

convertWithName = function (key, value) {

    switch (key) {
        case 'cp':
            return Number(value);
        case 'dateNaissance':
            return convertDate(value);
        case 'hy':
            return convertBoolean(value);
        case 'prospAss':
            return convertBoolean(value);
        case 'prospBanque':
            return convertBoolean(value);
        case 'prospVE':
            return convertBoolean(value);
        case 'comptableId':
            return Number(value);
        case 'carte':
            return convertBoolean(value);
        default:
            return value; 
    }


}

module.exports = {
    convertDate: convertDate,
    convertBoolean: convertBoolean
}