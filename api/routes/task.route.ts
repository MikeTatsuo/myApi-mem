import { Application } from 'express';
import { Endpoints, RoutesConfig } from '../common';
import { TasksController } from '../controllers';
import { configureRoutes } from '../interfaces';
import { JwtMiddleware, TasksMiddleware } from '../middleware';

const { task } = Endpoints;

export class TaskRoutes extends RoutesConfig implements configureRoutes {
	constructor(app: Application) {
		super(app, 'TaskRoute');
		this.configureRoutes();
	}

	configureRoutes(): void {
		const taskController = new TasksController();
		const taskMiddleware = TasksMiddleware.getInstance();
		const jwtMiddleware = JwtMiddleware.getInstance();

		this.app.delete(task, [jwtMiddleware.validJWTNeeded, taskMiddleware.validateIdDoesExist]);

		this.app.delete(`${task}/:taskId`, [
			jwtMiddleware.validJWTNeeded,
			taskMiddleware.validateIdDoesExist,
			taskMiddleware.extractTaskId,
			taskController.removeTask,
		]);

		this.app.get(`${task}/:taskId`, [
			jwtMiddleware.validJWTNeeded,
			taskMiddleware.validateIdDoesExist,
			taskMiddleware.extractTaskId,
			taskController.getTaskById,
		]);

		this.app.patch(task, [jwtMiddleware.validJWTNeeded, taskMiddleware.validateIdDoesExist]);

		this.app.patch(`${task}/:taskId`, [
			jwtMiddleware.validJWTNeeded,
			taskMiddleware.validateIdDoesExist,
			taskMiddleware.validateBodyFields,
			taskMiddleware.validateSameNameDoesntExist,
			taskMiddleware.extractTaskId,
			taskController.patch,
		]);

		this.app.post(task, [
			jwtMiddleware.validJWTNeeded,
			taskMiddleware.validateBodyFields,
			taskMiddleware.validateRequiredTaskBodyFields,
			taskMiddleware.validateSameNameDoesntExist,
			taskController.createTask,
		]);

		this.app.put(task, [jwtMiddleware.validJWTNeeded, taskMiddleware.validateIdDoesExist]);

		this.app.put(`${task}/:taskId`, [
			jwtMiddleware.validJWTNeeded,
			taskMiddleware.validateIdDoesExist,
			taskMiddleware.validateBodyFields,
			taskMiddleware.validateRequiredTaskBodyFields,
			taskMiddleware.validateSameNameDoesntExist,
			taskMiddleware.extractTaskId,
			taskController.put,
		]);
	}
}
