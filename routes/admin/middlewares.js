const { validationResult } = require('express-validator');
const usersRepo = require('../../repositories/users');



module.exports = {
    handleErrors(templateFunc, dataCb) {
        return async (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                let data = {};
                if (dataCb) data = await dataCb(req);
                return res.send(templateFunc({ errors, ...data }));
            }
            next();
        }
    },
    async requireAuth(req, res, next) {
        const user = await usersRepo.getOne(req.session.userID);
        if (!user) {
            return res.redirect('/signin');
        }
        next();
    }
}