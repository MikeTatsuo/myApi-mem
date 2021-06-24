import { HttpCodes } from '../common';
import { Request, Response } from 'express';
import { HistoriesService } from '../services';

const { CREATED, OK } = HttpCodes;

export class HistoriesController {
	createHistory({ body }: Request, res: Response): void {
		const historiesService = HistoriesService.getInstance();
		const createdHistory = historiesService.create(body);

		res.status(CREATED).send(createdHistory);
	}

	getHistoryById({ params }: Request, res: Response): void {
		const historiesService = HistoriesService.getInstance();
		const retrievedHistory = historiesService.getById(params.historyId);

		res.status(OK).send(retrievedHistory);
	}

	listHistories(req: Request, res: Response): void {
		const historiesService = HistoriesService.getInstance();
		const historyList = historiesService.list();

		res.status(OK).send(historyList);
	}

	patch({ body, params }: Request, res: Response): void {
		const historiesService = HistoriesService.getInstance();
		const patchedHistory = historiesService.patchById(params.historyId, body);

		res.status(OK).send(patchedHistory);
	}

	put({ body, params }: Request, res: Response): void {
		const historiesService = HistoriesService.getInstance();
		const updatedHistory = historiesService.updateById(params.historyId, body);

		res.status(OK).send(updatedHistory);
	}

	removeUser({ params }: Request, res: Response): void {
		const historyService = HistoriesService.getInstance();
		const deletedHistoryId = historyService.deleteById(params.historyId);

		res.status(OK).send(deletedHistoryId);
	}
}
