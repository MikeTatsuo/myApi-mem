import { Application } from 'express';
import { Endpoints, RoutesConfig } from '../common';
import { UsersController } from '../controllers';
import { configureRoutes } from '../interfaces';
import { JwtMiddleware, UsersMiddleware } from '../middleware';

const { users } = Endpoints;

export class UsersRoutes extends RoutesConfig implements configureRoutes {
	constructor(app: Application) {
		super(app, 'UsersRoute');
		this.configureRoutes();
	}

	configureRoutes(): void {
		const usersController = new UsersController();
		const usersMiddleware = UsersMiddleware.getInstance();
		const jwtMiddleware = JwtMiddleware.getInstance();

		this.app.delete(users, [jwtMiddleware.validJWTNeeded, usersMiddleware.validateIdDoesExist]);

		this.app.delete(`${users}/:userId`, [
			jwtMiddleware.validJWTNeeded,
			usersMiddleware.validateIdDoesExist,
			usersMiddleware.extractUserId,
			usersController.removeUser,
		]);

		this.app.get(users, [jwtMiddleware.validJWTNeeded, usersController.listUsers]);

		this.app.get(`${users}/:userId`, [
			jwtMiddleware.validJWTNeeded,
			usersMiddleware.validateIdDoesExist,
			usersMiddleware.extractUserId,
			usersController.getUserById,
		]);

		this.app.patch(users, [jwtMiddleware.validJWTNeeded, usersMiddleware.validateIdDoesExist]);

		this.app.patch(`${users}/:userId`, [
			jwtMiddleware.validJWTNeeded,
			usersMiddleware.validateIdDoesExist,
			usersMiddleware.validateBodyFields,
			usersMiddleware.validateSameUsernameDoesntExist,
			usersMiddleware.validateSameEmailDoesntExist,
			usersMiddleware.extractUserId,
			usersController.patch,
		]);

		this.app.post(users, [
			usersMiddleware.validateRequiredUserBodyFields,
			usersMiddleware.validateSameUsernameDoesntExist,
			usersMiddleware.validateSameEmailDoesntExist,
			usersController.createUser,
		]);

		this.app.put(users, [jwtMiddleware.validJWTNeeded, usersMiddleware.validateIdDoesExist]);

		this.app.put(`${users}/:userId`, [
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
