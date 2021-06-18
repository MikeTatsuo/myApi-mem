import { Application } from 'express';
import { Endpoints, RoutesConfig } from '../common';
import { TasksController } from '../controllers';
import { configureRoutes } from '../interfaces';
import { JwtMiddleware } from '../middleware';

const { tasks } = Endpoints;

export class TasksRoutes extends RoutesConfig implements configureRoutes {
	constructor(app: Application) {
		super(app, 'TaskRoute');
		this.configureRoutes();
	}

	configureRoutes(): void {
		const taskController = new TasksController();
		const jwtMiddleware = JwtMiddleware.getInstance();

		this.app.get(tasks, [jwtMiddleware.validJWTNeeded, taskController.listTasks]);
	}
}
