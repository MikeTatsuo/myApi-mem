import { HistoryDao } from '../dao';
import { CRUD, BaseObject, History, Task } from '../interfaces';
import { TasksService } from './task.service';

export class HistoriesService implements CRUD<History> {
	private static instance: HistoriesService;
	historyDao: HistoryDao;
	taskService: TasksService;

	constructor() {
		this.historyDao = HistoryDao.getInstance();
		this.taskService = TasksService.getInstance();
	}

	static getInstance(): HistoriesService {
		if (!HistoriesService.instance) HistoriesService.instance = new HistoriesService();

		return HistoriesService.instance;
	}

	create(resource: History): History {
		const createdHistory = this.historyDao.add<History>(resource);
		const { tasks } = createdHistory;
		createdHistory.tasks = tasks ?? [];

		return createdHistory;
	}

	deleteById(resourceId: string): BaseObject {
		const historyId = Number(resourceId);

		return this.historyDao.removeById(historyId);
	}

	list(limit = 20, page = 1): History[] {
		const historiesList = this.historyDao.getList<History>(limit, page);
		return historiesList.map((history: History) => {
			history.tasks = this.taskService.listByHistoryId(history.id);
			return history;
		});
	}

	patchById(resourceId: string, resource: History): History {
		const historyId = Number(resourceId);
		const { id, name, finished, tasks } = resource;
		resource = { ...resource, id: Number(id) };

		if (name) resource = { ...resource, name };
		if (finished) resource = { ...resource, finished };
		if (tasks?.length) resource = { ...resource, tasks };

		const patchedHistory = this.historyDao.patchById<History>(historyId, resource);
		patchedHistory.tasks = patchedHistory.tasks?.map((task: Task) =>
			this.taskService.patchById(String(task.id), task)
		);

		return patchedHistory;
	}

	getById(resourceId: string): History {
		const historyId = Number(resourceId);

		const history = this.historyDao.getById<History>(historyId);
		const { tasks } = history;
		history.tasks = tasks?.map((task: Task) => this.taskService.getById(String(task.id)));

		return history;
	}

	getByParam(param: string, value: unknown): History {
		return this.historyDao.getByParams<History>(param, value);
	}

	updateById(resourceId: string, resource: History): History {
		const historyId = Number(resourceId);
		const { id, name, finished, tasks } = resource;
		resource = { id: Number(id), name, finished, tasks };

		const updatedHistory = this.historyDao.putById<History>(historyId, resource);

		updatedHistory.tasks = updatedHistory.tasks?.map((task: Task) =>
			this.taskService.updateById(String(task.id), task)
		);

		return updatedHistory;
	}
}
