import { Application } from 'express';
import { Endpoints, RoutesConfig } from '../common';
import { HistoriesController } from '../controllers';
import { configureRoutes } from '../interfaces';
import { JwtMiddleware } from '../middleware';

const { histories } = Endpoints;

export class HistoriesRoutes extends RoutesConfig implements configureRoutes {
	constructor(app: Application) {
		super(app, 'HistoryRoute');
		this.configureRoutes();
	}

	configureRoutes(): void {
		const historiesController = new HistoriesController();
		const jwtMiddleware = JwtMiddleware.getInstance();

		this.app.get(histories, [jwtMiddleware.validJWTNeeded, historiesController.listHistories]);
	}
}
