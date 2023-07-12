const _validator = {};

_validator.isValidEmail = function (sEmail) {
    var re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(sEmail).toLowerCase());
};

_validator.isValidString = function (sString) {
    return sString.trim().length > 0 && sString.trim().length <= 100;
};

_validator.isInteger = function (nNumber) {
    return Number.isInteger(nNumber);
};

_validator.isNumber = function (nNumber) {
    return !isNaN(nNumber);
};

_validator.isValidLink = function (sLink) {
    const reWebsite =
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;
    return reWebsite.test(sLink);
};

_validator.isValidName = function (sName) {
    const reName = /^[a-zA-Z](( )?[a-zA-Z]+)*$/;
    return reName.test(sName);
};

_validator.validateEmpty = function (name) {
    var re = /^(?![-])[\w-]+$/;
    return re.test(String(name));
};

_validator.isValidUserName = function (sName) {
    const reName = /^[a-zA-Z][a-zA-Z0-9\_\-]{4,14}$/;
    return reName.test(sName);
};

_validator.isValidStringName = function (sString) {
    return sString.trim().length > 0 && sString.trim().length <= 25;
};

_validator.isExponential = function (nBasePrice) {
    const regex = /^(?!.*[eE]).*[0-9]$/;
    return regex.test(nBasePrice);
};
