import { Application } from 'express';
import { Endpoints, RoutesConfig } from '../common';
import { HistoriesController } from '../controllers';
import { configureRoutes } from '../interfaces';
import { JwtMiddleware, HistoriesMiddleware } from '../middleware';

const { history } = Endpoints;

export class HistoryRoutes extends RoutesConfig implements configureRoutes {
	constructor(app: Application) {
		super(app, 'HistoryRoute');
		this.configureRoutes();
	}

	configureRoutes(): void {
		const historiesController = new HistoriesController();
		const historiesMiddleware = HistoriesMiddleware.getInstance();
		const jwtMiddleware = JwtMiddleware.getInstance();

		this.app.delete(history, [
			jwtMiddleware.validJWTNeeded,
			historiesMiddleware.validateIdDoesExist,
		]);

		this.app.delete(`${history}/:historyId`, [
			jwtMiddleware.validJWTNeeded,
			historiesMiddleware.validateIdDoesExist,
			historiesMiddleware.validateCanBeDeleted,
			historiesController.createHistory,
		]);

		this.app.get(history, [jwtMiddleware.validJWTNeeded, historiesController.listHistories]);

		this.app.get(`${history}/:historyId`, [
			jwtMiddleware.validJWTNeeded,
			historiesMiddleware.validateIdDoesExist,
			historiesMiddleware.extractHistoryId,
			historiesController.getHistoryById,
		]);

		this.app.patch(history, [
			jwtMiddleware.validJWTNeeded,
			historiesMiddleware.validateIdDoesExist,
		]);

		this.app.patch(`${history}/:historyId`, [
			jwtMiddleware.validJWTNeeded,
			historiesMiddleware.validateIdDoesExist,
			historiesMiddleware.validateBodyFields,
			historiesMiddleware.validateSameNameDoesntExist,
			historiesMiddleware.extractHistoryId,
			historiesController.patch,
		]);

		this.app.post(history, [
			jwtMiddleware.validJWTNeeded,
			historiesMiddleware.validateSameNameDoesntExist,
			historiesController.createHistory,
		]);

		this.app.put(history, [jwtMiddleware.validJWTNeeded, historiesMiddleware.validateIdDoesExist]);

		this.app.put(`${history}/:historyId`, [
			jwtMiddleware.validJWTNeeded,
			historiesMiddleware.validateIdDoesExist,
			historiesMiddleware.validateRequiredHistoryBodyFields,
			historiesMiddleware.validateSameNameDoesntExist,
			historiesMiddleware.extractHistoryId,
			historiesController.put,
		]);
	}
}
