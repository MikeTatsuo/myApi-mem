import { Application } from 'express';
import { Endpoints, RoutesConfig } from '../common';
import { UsersController } from '../controllers';
import { configureRoutes } from '../interfaces';
import { JwtMiddleware, UsersMiddleware } from '../middleware';

const { user } = Endpoints;

export class UserRoutes extends RoutesConfig implements configureRoutes {
	constructor(app: Application) {
		super(app, 'UsersRoute');
		this.configureRoutes();
	}

	configureRoutes(): void {
		const usersController = new UsersController();
		const usersMiddleware = UsersMiddleware.getInstance();
		const jwtMiddleware = JwtMiddleware.getInstance();

		this.app.delete(user, [jwtMiddleware.validJWTNeeded, usersMiddleware.validateIdDoesExist]);

		this.app.delete(`${user}/:userId`, [
			jwtMiddleware.validJWTNeeded,
			usersMiddleware.validateIdDoesExist,
			usersMiddleware.extractUserId,
			usersController.removeUser,
		]);

		this.app.get(`${user}/:userId`, [
			jwtMiddleware.validJWTNeeded,
			usersMiddleware.validateIdDoesExist,
			usersMiddleware.extractUserId,
			usersController.getUserById,
		]);

		this.app.patch(user, [jwtMiddleware.validJWTNeeded, usersMiddleware.validateIdDoesExist]);

		this.app.patch(`${user}/:userId`, [
			jwtMiddleware.validJWTNeeded,
			usersMiddleware.validateIdDoesExist,
			usersMiddleware.validateBodyFields,
			usersMiddleware.validateSameUsernameDoesntExist,
			usersMiddleware.validateSameEmailDoesntExist,
			usersMiddleware.extractUserId,
			usersController.patch,
		]);

		this.app.post(user, [
			usersMiddleware.validateRequiredUserBodyFields,
			usersMiddleware.validateSameUsernameDoesntExist,
			usersMiddleware.validateSameEmailDoesntExist,
			usersController.createUser,
		]);

		this.app.put(user, [jwtMiddleware.validJWTNeeded, usersMiddleware.validateIdDoesExist]);

		this.app.put(`${user}/:userId`, [
			jwtMiddleware.validJWTNeeded,
			usersMiddleware.validateIdDoesExist,
			usersMiddleware.validateRequiredUserBodyFields,
			usersMiddleware.validateSameUsernameDoesntExist,
			usersMiddleware.validateSameEmailDoesntExist,
			usersMiddleware.extractUserId,
			usersController.put,
		]);
	}
}
