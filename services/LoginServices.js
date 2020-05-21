const axios = require('axios');
const logger = require('../utility/logger');
const CircularJSON = require('circular-json');
const commonService = require('../services/commonServices');
async function doAuthenticate(userName, passWord) {

    let hashPassword = commonService.doMd5(passWord);

    const loginModel = {
        'axpapp': 'easyconnect',
        'username': '',
        'password': '',
        'seed': '1983',
        'other': 'Chrome'
    };
    loginModel.username = userName;
    loginModel.password = hashPassword;
    const login = {};
    const paramValue = {};
    const _parameter = [];

    const sessionId = '';

    login['login'] = loginModel;
    _parameter.push(login);
    paramValue['_parameters'] = _parameter;
    logger.info(`Final paramValue ::: ${JSON.stringify(paramValue)}`);

    return new Promise((resolve, reject) => {
        axios
            .post(`${process.env.LOG_URL}ASBMenuRest.dll/datasnap/rest/TASBMenuREST/Login`, JSON.stringify(paramValue))
            .then(
                returnData => {
                    logger.info(`Login Response::: ${returnData}`);
                    return resolve(JSON.parse(JSON.stringify(CircularJSON.stringify(returnData.data))));
                }
            ).catch(
                reason => {
                    logger.error(`API Error:: ${reason}`);
                    return reject(reason);
                }
            )
    });
}

module.exports = LoginService = {
    doAuthenticate
}