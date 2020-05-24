const loginService = require('../services/LoginServices');
const logger = require('../utility/logger');
const jwt = require('jsonwebtoken');
const commonServices = require('../services/commonServices');

const users = [{
        "ugroup": "doctor",
        "uroles": "doctor",
        "username": "Balaji Krishnan",
        "name": "",
        "userid": 101
    }, {
        "ugroup": "doctor",
        "uroles": "doctor",
        "username": "Ramesh",
        "name": "",
        "userid": 102
    }, {
        "ugroup": "doctor",
        "uroles": "doctor",
        "username": "Ravi",
        "name": "",
        "userid": 103
    }, {
        "ugroup": "client",
        "uroles": "client",
        "username": "Kumaravelmani",
        "userid": 394998,
        "age": 23,
        "gender": "Male"
    },
    {
        "ugroup": "client",
        "uroles": "client",
        "username": "Tamilrasi",
        "userid": 394999,
        "age": 35,
        "gender": "Female"
    },
    {
        "ugroup": "client",
        "uroles": "client",
        "username": "Venkat",
        "userid": 394990,
        "age": 43,
        "gender": "Male"
    }
];

const lgModule = {
    login: async(req, res, next) => {
        let errorMsg = 'Invalid Username or Password';

        try {
            const logObj = req.body;
            // const curSession = req.session;
            logger.info(`LOGIN API ::: ${JSON.stringify(logObj)}`);
            loginService.doAuthenticate(logObj.userName, logObj.passWord)
                .then(
                    result => {
                        const resultData = JSON.parse(result);
                        logger.info(`Response Here is : ${JSON.stringify(resultData)}`);

                        if (resultData.result[0].error) {
                            res.render('index', { errorMessage: 'Invalid Username and Password' });
                        } else {
                            logger.info(`Response::: ${JSON.stringify(resultData.result[0].result)}`);

                            const body = { data: logObj.userName };
                            const jwtToken = process.env.JWT_SECRET;
                            const token = jwt.sign(body, jwtToken, { expiresIn: '6h' });

                            let responsedata = {
                                jwtToken: token,
                                userProfiles: JSON.stringify(resultData.result[0].result),
                            };
                            logger.info(`Usergroup ::: ${resultData.result[0].result.ugroup}`);
                            // if (!commonServices.isAuthorizedUser(resultData.result[0].result.ugroup)) {
                            //     errorMsg = 'You are not authorized to access this application';
                            //     logger.info(errorMsg);

                            //     res.render('index', { errorMessage: errorMsg });
                            // }
                            // logger.info(`After`);

                            const envValue = {
                                "DEV_MODE": false,
                                "ENV_MODE": "env:var",
                                "API_URL": process.env.API_URL

                            };
                            res.render('preloading', { userProfiles: responsedata.userProfiles, jwtToken: responsedata.jwtToken, config: JSON.stringify(envValue) });


                        }
                    }
                )
                .catch(
                    reason => {
                        logger.error(`Error LOGIN SERVICE ::: ${reason}`);
                        // curSession.errMessage = 'Invalid Username or Password';
                        res.render('index', { errorMessage: errorMsg });
                    }
                );
        } catch (err) {
            logger.error(`Error LOGIN API :::  ${err}`);
            res.render('index', { errorMessage: 'Invalid Username and Password' });
        }
    },
    demologin: async(req, res, next) => {
        let errorMsg = 'Invalid Username or Password';
        if (req.body.userName) {
            let user = users.filter(u =>
                u.userid == req.body.userName
            );
            let filteredDoctors = users.filter(u =>
                u.ugroup === "doctor"
            );
            if (user && user.length === 1) {
                res.render('preloading', { userProfiles: user[0], availableDoctors: filteredDoctors });
            } else {
                res.render('index', { errorMsg });
            }
        } else {
            res.render('index', { errorMsg: '' });
        }

    }
}
module.exports = lgModule;