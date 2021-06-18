import { Application } from 'express';
import { Endpoints, RoutesConfig } from '../common';
// import { UsersController } from '../controllers';
import { configureRoutes } from '../interfaces';
// import { JwtMiddleware, UsersMiddleware } from '../middleware';
import { JwtMiddleware } from '../middleware';

const { task } = Endpoints;

export class TaskRoutes extends RoutesConfig implements configureRoutes {
	constructor(app: Application) {
		super(app, 'TaskRoute');
		this.configureRoutes();
	}

	configureRoutes(): void {
		// const usersController = new UsersController();
		// const usersMiddleware = UsersMiddleware.getInstance();
		const jwtMiddleware = JwtMiddleware.getInstance();

		// this.app.delete(users, [jwtMiddleware.validJWTNeeded, usersMiddleware.validateIdDoesExist]);
		this.app.delete(task, [jwtMiddleware.validJWTNeeded]);

		// this.app.delete(`${users}/:userId`, [
		// 	jwtMiddleware.validJWTNeeded,
		// 	usersMiddleware.validateIdDoesExist,
		// 	usersMiddleware.extractUserId,
		// 	usersController.removeUser,
		// ]);

		this.app.delete(`${task}/:taskId`, [jwtMiddleware.validJWTNeeded]);

		// this.app.get(history, [jwtMiddleware.validJWTNeeded, usersController.listUsers]);
		this.app.get(task, [jwtMiddleware.validJWTNeeded]);

		// this.app.get(`${history}/:taskId`, [
		// 	jwtMiddleware.validJWTNeeded,
		// 	usersMiddleware.validateIdDoesExist,
		// 	usersMiddleware.extractUserId,
		// 	usersController.getUserById,
		// ]);

		this.app.get(`${task}/:taskId`, [
			jwtMiddleware.validJWTNeeded,
			// usersMiddleware.validateIdDoesExist,
			// usersMiddleware.extractUserId,
			// usersController.getUserById,
		]);

		// this.app.patch(history, [jwtMiddleware.validJWTNeeded, usersMiddleware.validateIdDoesExist]);
		this.app.patch(task, [jwtMiddleware.validJWTNeeded]);

		// this.app.patch(`${history}/:taskId`, [
		// 	jwtMiddleware.validJWTNeeded,
		// 	usersMiddleware.validateIdDoesExist,
		// 	usersMiddleware.validateBodyFields,
		// 	usersMiddleware.validateSameUsernameDoesntExist,
		// 	usersMiddleware.validateSameEmailDoesntExist,
		// 	usersMiddleware.extractUserId,
		// 	usersController.patch,
		// ]);

		this.app.patch(`${task}/:taskId`, [jwtMiddleware.validJWTNeeded]);

		// this.app.post(history, [
		// 	usersMiddleware.validateRequiredUserBodyFields,
		// 	usersMiddleware.validateSameUsernameDoesntExist,
		// 	usersMiddleware.validateSameEmailDoesntExist,
		// 	usersController.createUser,
		// ]);

		this.app.post(task, [jwtMiddleware.validJWTNeeded]);

		// this.app.put(history, [jwtMiddleware.validJWTNeeded, usersMiddleware.validateIdDoesExist]);
		this.app.put(task, [jwtMiddleware.validJWTNeeded]);

		// this.app.put(`${history}/:userId`, [
		// 	jwtMiddleware.validJWTNeeded,
		// 	usersMiddleware.validateIdDoesExist,
		// 	usersMiddleware.validateRequiredUserBodyFields,
		// 	usersMiddleware.validateSameUsernameDoesntExist,
		// 	usersMiddleware.validateSameEmailDoesntExist,
		// 	usersMiddleware.extractUserId,
		// 	usersController.put,
		// ]);

		this.app.put(`${task}/:taskId`, [jwtMiddleware.validJWTNeeded]);
	}
}
