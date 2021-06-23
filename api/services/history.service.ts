import { HistoryDao } from '../dao';
import { CRUD, BaseObject, History } from '../interfaces';

export class HistoriesService implements CRUD<History> {
	private static instance: HistoriesService;
	historyDao: HistoryDao;

	constructor() {
		this.historyDao = HistoryDao.getInstance();
	}

	static getInstance(): HistoriesService {
		if (!HistoriesService.instance) HistoriesService.instance = new HistoriesService();

		return HistoriesService.instance;
	}

	create(resource: History): History {
		return this.historyDao.add<History>(resource);
	}

	deleteById(resourceId: string): BaseObject {
		const historyId = Number(resourceId);

		return this.historyDao.removeById(historyId);
	}

	list(limit = 20, page = 1): History[] {
		return this.historyDao.getList<History>(limit, page);
	}

	patchById(resourceId: string, resource: History): History {
		const historyId = Number(resourceId);
		const { id, name, finished, tasks } = resource;
		resource = { ...resource, id: Number(id) };

		if (name) resource = { ...resource, name };
		if (finished) resource = { ...resource, finished };
		if (tasks?.length) resource = { ...resource, tasks };

		return this.historyDao.patchById<History>(historyId, resource);
	}

	getById(resourceId: string): History {
		const historyId = Number(resourceId);

		return this.historyDao.getById<History>(historyId);
	}

	getByParam(param: string, value: unknown): History {
		return this.historyDao.getByParams<History>(param, value);
	}

	updateById(resourceId: string, resource: History): History {
		const historyId = Number(resourceId);
		const { id, name, finished, tasks } = resource;
		resource = { id: Number(id), name, finished, tasks };

		return this.historyDao.putById<History>(historyId, resource);
	}

	formatHistory(history: History): History {
		const formattedHistory: History = { ...history };

		if (!history.tasks?.length) delete formattedHistory.tasks;

		return formattedHistory;
	}
}
