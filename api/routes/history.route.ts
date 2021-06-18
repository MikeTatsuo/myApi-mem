import { Application } from 'express';
import { Endpoints, RoutesConfig } from '../common';
// import { UsersController } from '../controllers';
import { configureRoutes } from '../interfaces';
// import { JwtMiddleware, UsersMiddleware } from '../middleware';
import { JwtMiddleware } from '../middleware';

const { history } = Endpoints;

export class HistoryRoutes extends RoutesConfig implements configureRoutes {
	constructor(app: Application) {
		super(app, 'HistoryRoute');
		this.configureRoutes();
	}

	configureRoutes(): void {
		// const usersController = new UsersController();
		// const usersMiddleware = UsersMiddleware.getInstance();
		const jwtMiddleware = JwtMiddleware.getInstance();

		// this.app.delete(users, [jwtMiddleware.validJWTNeeded, usersMiddleware.validateIdDoesExist]);
		this.app.delete(history, [jwtMiddleware.validJWTNeeded]);

		// this.app.delete(`${users}/:userId`, [
		// 	jwtMiddleware.validJWTNeeded,
		// 	usersMiddleware.validateIdDoesExist,
		// 	usersMiddleware.extractUserId,
		// 	usersController.removeUser,
		// ]);

		this.app.delete(`${history}/:historyId`, [jwtMiddleware.validJWTNeeded]);

		// this.app.get(history, [jwtMiddleware.validJWTNeeded, usersController.listUsers]);
		this.app.get(history, [jwtMiddleware.validJWTNeeded]);

		// this.app.get(`${history}/:historyId`, [
		// 	jwtMiddleware.validJWTNeeded,
		// 	usersMiddleware.validateIdDoesExist,
		// 	usersMiddleware.extractUserId,
		// 	usersController.getUserById,
		// ]);

		this.app.get(`${history}/:historyId`, [
			jwtMiddleware.validJWTNeeded,
			// usersMiddleware.validateIdDoesExist,
			// usersMiddleware.extractUserId,
			// usersController.getUserById,
		]);

		// this.app.patch(history, [jwtMiddleware.validJWTNeeded, usersMiddleware.validateIdDoesExist]);
		this.app.patch(history, [jwtMiddleware.validJWTNeeded]);

		// this.app.patch(`${history}/:historyId`, [
		// 	jwtMiddleware.validJWTNeeded,
		// 	usersMiddleware.validateIdDoesExist,
		// 	usersMiddleware.validateBodyFields,
		// 	usersMiddleware.validateSameUsernameDoesntExist,
		// 	usersMiddleware.validateSameEmailDoesntExist,
		// 	usersMiddleware.extractUserId,
		// 	usersController.patch,
		// ]);

		this.app.patch(`${history}/:historyId`, [jwtMiddleware.validJWTNeeded]);

		// this.app.post(history, [
		// 	usersMiddleware.validateRequiredUserBodyFields,
		// 	usersMiddleware.validateSameUsernameDoesntExist,
		// 	usersMiddleware.validateSameEmailDoesntExist,
		// 	usersController.createUser,
		// ]);

		this.app.post(history, [jwtMiddleware.validJWTNeeded]);

		// this.app.put(history, [jwtMiddleware.validJWTNeeded, usersMiddleware.validateIdDoesExist]);
		this.app.put(history, [jwtMiddleware.validJWTNeeded]);

		// this.app.put(`${history}/:userId`, [
		// 	jwtMiddleware.validJWTNeeded,
		// 	usersMiddleware.validateIdDoesExist,
		// 	usersMiddleware.validateRequiredUserBodyFields,
		// 	usersMiddleware.validateSameUsernameDoesntExist,
		// 	usersMiddleware.validateSameEmailDoesntExist,
		// 	usersMiddleware.extractUserId,
		// 	usersController.put,
		// ]);

		this.app.put(`${history}/:historyId`, [jwtMiddleware.validJWTNeeded]);
	}
}
