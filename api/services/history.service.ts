import { GenericInMemoryDao } from '../dao';
import { CRUD, BaseObject, History } from '../interfaces';

export class HistoriesService implements CRUD<History> {
	private static instance: HistoriesService;
	dao: GenericInMemoryDao;

	constructor() {
		this.dao = GenericInMemoryDao.getInstance();
	}

	static getInstance(): HistoriesService {
		if (!HistoriesService.instance) HistoriesService.instance = new HistoriesService();

		return HistoriesService.instance;
	}

	create(resource: History): History {
		return this.dao.add<History>(resource);
	}

	deleteById(resourceId: string): BaseObject {
		const historyId = Number(resourceId);

		return this.dao.removeById(historyId);
	}

	list(limit = 20, page = 1): History[] {
		return this.dao.getList<History>(limit, page);
	}

	patchById(resourceId: string, resource: History): History {
		const historyId = Number(resourceId);
		const { id, name, finished, tasks } = resource;
		resource = { ...resource, id: Number(id) };

		if (name) resource = { ...resource, name };
		if (finished) resource = { ...resource, finished };
		if (tasks?.length) resource = { ...resource, tasks };

		return this.dao.patchById<History>(historyId, resource);
	}

	getById(resourceId: string): History {
		const historyId = Number(resourceId);

		return this.dao.getById<History>(historyId);
	}

	getByParam(param: string, value: unknown): History {
		return this.dao.getByParams<History>(param, value);
	}

	updateById(resourceId: string, resource: History): History {
		const historyId = Number(resourceId);
		const { id, name, finished, tasks } = resource;
		resource = { id: Number(id), name, finished, tasks };

		return this.dao.putById<History>(historyId, resource);
	}

	formatHistory(history: History): History {
		const formattedHistory: History = { ...history };

		if (!history.tasks?.length) delete formattedHistory.tasks;

		return formattedHistory;
	}
}
