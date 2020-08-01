let apiRouter = require('express').Router();
var userController = require('../../controllers/userController');
var authController = require('../../controllers/authController');
const passport = require('passport');
var passportConfig = require('../../config/passport');
    passportConfig();

apiRouter.get('/', function (req, res) {
    res.json({
        status: 'API Its Working',
        message: 'Welcome to RESTfull API'
    });
});

apiRouter.route('/login')
    .post(userController.login);
apiRouter.post('/logout', authController.isAuthenticated, userController.logout);

apiRouter.route('/user')
    .get(authController.isAuthenticated, userController.index)
    .post(userController.new);

apiRouter.route('/user/:id')
    .get(authController.isAuthenticated, userController.view)
    .patch(authController.isAuthenticated, userController.update)
    .put(authController.isAuthenticated, userController.update)
    .delete(authController.isAuthenticated, userController.delete);

apiRouter.route('/social-signin/facebook')
    .post(passport.authenticate('facebookToken', { session: false }), userController.socialSignin);

apiRouter.route('/social-signin/google')   
    .post(passport.authenticate('googleToken', { session: false }), userController.socialSignin);

module.exports = apiRouter;