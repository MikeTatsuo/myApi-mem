import { TaskTimeDao } from '../dao';
import { CRUD, BaseObject, TaskTime } from '../interfaces';

export class TaskTimeService implements CRUD<TaskTime> {
	private static instance: TaskTimeService;
	taskTimeDao: TaskTimeDao;

	constructor() {
		this.taskTimeDao = TaskTimeDao.getInstance();
	}

	static getInstance(): TaskTimeService {
		if (!TaskTimeService.instance) TaskTimeService.instance = new TaskTimeService();

		return TaskTimeService.instance;
	}

	create(resource: TaskTime): TaskTime {
		return this.taskTimeDao.add<TaskTime>(resource);
	}

	deleteById(resouceId: string): BaseObject {
		const taskId = Number(resouceId);

		return this.taskTimeDao.removeById(taskId);
	}

	list(): TaskTime[] {
		return this.taskTimeDao.getList<TaskTime>();
	}

	listByTaskId(taskId: number): TaskTime[] {
		const timeTableList = this.taskTimeDao.getList<TaskTime>();
		return timeTableList.filter((taskTime: TaskTime) => taskTime.taskId === taskId);
	}

	patchById(resourceId: string, resource: TaskTime): TaskTime {
		const timeTableId = Number(resourceId);
		const { id, end, start, taskId } = resource;
		resource = { ...resource, id: Number(id) };

		if (end) resource = { ...resource, end };
		if (start) resource = { ...resource, start };
		if (taskId) resource = { ...resource, taskId };

		return this.taskTimeDao.patchById<TaskTime>(timeTableId, resource);
	}

	getById(resourceId: string): TaskTime {
		const taskId = Number(resourceId);

		return this.taskTimeDao.getById<TaskTime>(taskId);
	}

	getByParam(param: string, value: unknown): TaskTime {
		return this.taskTimeDao.getByParams<TaskTime>(param, value);
	}

	updateById(resourceId: string, resource: TaskTime): TaskTime {
		const timeTableId = Number(resourceId);
		const { id, end, start, taskId } = resource;
		resource = { id: Number(id), end, start, taskId };

		return this.taskTimeDao.putById<TaskTime>(timeTableId, resource);
	}

	formatTimeTable(task: TaskTime): TaskTime {
		const formattedTask: TaskTime = { ...task };

		if (!task.end) delete formattedTask.end;

		return formattedTask;
	}
}
