import { GenericInMemoryDao } from '../dao';
import { CRUD, BaseObject, Task } from '../interfaces';

export class TasksService implements CRUD<Task> {
	private static instance: TasksService;
	dao: GenericInMemoryDao;

	constructor() {
		this.dao = GenericInMemoryDao.getInstance();
	}

	static getInstance(): TasksService {
		if (!TasksService.instance) TasksService.instance = new TasksService();

		return TasksService.instance;
	}

	create(resource: Task): Task {
		return this.dao.add<Task>(resource);
	}

	deleteById(resouceId: string): BaseObject {
		const taskId = Number(resouceId);

		return this.dao.removeById(taskId);
	}

	list(limit = 20, page = 1): Task[] {
		return this.dao.getList<Task>(limit, page);
	}

	patchById(resourceId: string, resource: Task): Task {
		const taskId = Number(resourceId);
		const { id, finished, name, timeTable, observation } = resource;
		resource = { ...resource, id: Number(id) };

		if (finished) resource = { ...resource, finished };
		if (name) resource = { ...resource, name };
		if (observation) resource = { ...resource, observation };
		if (timeTable?.length) resource = { ...resource, timeTable };

		return this.dao.patchById<Task>(taskId, resource);
	}

	getById(resourceId: string): Task {
		const taskId = Number(resourceId);

		return this.dao.getById<Task>(taskId);
	}

	getByParam(param: string, value: unknown): Task {
		return this.dao.getByParams<Task>(param, value);
	}

	updateById(resourceId: string, resource: Task): Task {
		const taskId = Number(resourceId);
		const { id, name, finished, timeTable, observation } = resource;
		resource = { id: Number(id), name, finished, timeTable, observation };

		return this.dao.putById<Task>(taskId, resource);
	}

	formatTask(task: Task): Task {
		const formattedTask: Task = { ...task };

		if (!task.timeTable?.length) delete formattedTask.timeTable;
		if (!task.observation) delete formattedTask.observation;

		return formattedTask;
	}
}
