import { NextFunction, Request, Response } from 'express';
import { ErrorMsg, History } from '../interfaces';
import { HistoriesService } from '../services';
import { ErrorMsgs, HttpCodes } from '../common';
import { Methods } from '../common';

const { unableToDeleteHistory, historyExist, historyNotFound, invalidBody, missingParamId } =
	ErrorMsgs;
const { BAD_REQUEST, CONFLICT, NOT_FOUND } = HttpCodes;
const { DELETE, PUT } = Methods;

export class HistoriesMiddleware {
	private static instance: HistoriesMiddleware;

	static getInstance(): HistoriesMiddleware {
		if (!HistoriesMiddleware.instance) HistoriesMiddleware.instance = new HistoriesMiddleware();

		return HistoriesMiddleware.instance;
	}

	extractHistoryId({ body, params }: Request, res: Response, next: NextFunction): void {
		body.id = params.historyId;
		next();
	}

	async validateIdDoesExist({ params }: Request, res: Response, next: NextFunction): Promise<void> {
		const { historyId } = params;

		if (!historyId) {
			res.status(BAD_REQUEST).send(new ErrorMsg(missingParamId));
		} else {
			const historiesService = HistoriesService.getInstance();
			const history = await historiesService.getById(historyId);
			if (history) next();
			else res.status(NOT_FOUND).send(new ErrorMsg(historyNotFound));
		}
	}

	validateBodyFields({ body }: Request, res: Response, next: NextFunction): void {
		const { finished, name, tasks } = body;

		if (name || finished || tasks) next();
		else res.status(BAD_REQUEST).send(new ErrorMsg(invalidBody));
	}

	validateRequiredHistoryBodyFields({ body }: Request, res: Response, next: NextFunction): void {
		const { name, finished } = body;

		if (body && name && finished) {
			next();
		} else {
			let errorText = 'Missing required field';
			const errorFields = [];

			if (!name) errorFields.push(' name');
			if (!finished) errorFields.push(' finished');

			const lastField = errorFields.pop();
			errorText += errorFields.length ? `s:${errorFields} and${lastField}` : `:${lastField}`;

			res.status(BAD_REQUEST).send(new ErrorMsg(errorText));
		}
	}

	async validateSameNameDoesntExist(
		{ body, method, params }: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const historiesService = HistoriesService.getInstance();
		const { name } = body;
		const history = await historiesService.getByParam('name', name);

		if (history) {
			if (method === PUT && Number(params?.historyId) === (history as History).id) next();
			else res.status(BAD_REQUEST).send(new ErrorMsg(historyExist));
		} else {
			next();
		}
	}

	async validateCanBeDeleted(
		{ method, params }: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const historiesService = HistoriesService.getInstance();
		const { historyId } = params;
		const history = await historiesService.getById(historyId);

		if (history) {
			const taskLength = history.tasks?.length;
			if (method === DELETE && taskLength) res.status(CONFLICT).send(unableToDeleteHistory);
			else next();
		} else {
			res.status(NOT_FOUND).send(new ErrorMsg(historyNotFound));
		}
	}
}
