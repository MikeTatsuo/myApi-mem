import { HttpCodes } from '../common';
import { History } from '../interfaces';
import { Request, Response } from 'express';
import { HistoriesService } from '../services';

const { CREATED, OK } = HttpCodes;

export class HistoriesController {
	createHistory({ body }: Request, res: Response): void {
		const historiesService = HistoriesService.getInstance();
		const createdHistory = historiesService.create(body);
		const formattedHistory = historiesService.formatHistory(createdHistory);

		res.status(CREATED).send(formattedHistory);
	}

	getHistoryById({ params }: Request, res: Response): void {
		const historiesService = HistoriesService.getInstance();
		const retrievedHistory = historiesService.getById(params.historyId);
		const formattedHistory = historiesService.formatHistory(retrievedHistory);

		res.status(OK).send(formattedHistory);
	}

	listHistories(req: Request, res: Response): void {
		const historiesService = HistoriesService.getInstance();
		const historyList = historiesService.list();
		const formattedList = historyList.map((history: History) =>
			historiesService.formatHistory(history)
		);

		res.status(OK).send(formattedList);
	}

	patch({ body, params }: Request, res: Response): void {
		const historiesService = HistoriesService.getInstance();
		const patchedHistory = historiesService.patchById(params.historyId, body);
		const formattedHistory = historiesService.formatHistory(patchedHistory);

		res.status(OK).send(formattedHistory);
	}

	put({ body, params }: Request, res: Response): void {
		const historiesService = HistoriesService.getInstance();
		const updatedHistory = historiesService.updateById(params.historyId, body);
		const formattedHistory = historiesService.formatHistory(updatedHistory);

		res.status(OK).send(formattedHistory);
	}

	removeUser({ params }: Request, res: Response): void {
		const historyService = HistoriesService.getInstance();
		const deletedHistoryId = historyService.deleteById(params.historyId);

		res.status(OK).send(deletedHistoryId);
	}
}
