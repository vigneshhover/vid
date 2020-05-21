const fs = require("fs");
const md5 = require('md5');
const authorizedGroups = [
    'default',
    'doctor'
];

function getFilesizeInBytes(filename) {
    var stats = fs.statSync(filename)
    var fileSizeInBytes = stats["size"]
    return fileSizeInBytes
}

function doMd5(password) {

    return md5('1983'.concat(md5(password)));
}

function getDate(today) {

    var hours = `0${today.getHours()}`;
    var minutes = `0${today.getMinutes()}`.slice(-2);
    var seconds = `0${today.getSeconds()}`.slice(-2);
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    hours = `0${hours}`.slice(-2);
    var strTime = `${hours}:${minutes}:${seconds} ${ampm}`;

    var year = today.getFullYear();
    var month = `0${today.getMonth() + 1}`.slice(-2);
    var day = `0${today.getDate()}`.slice(-2);
    var date = [month, day, year].join('/') + ' ' + strTime;

    return date;
}

function isAuthorizedUser(userGroup) {
    return (authorizedGroups.indexOf(userGroup) !== -1);
}

module.exports = CommonService = {
    getFilesizeInBytes,
    doMd5,
    getDate,
    isAuthorizedUser
};