import { TaskDao } from '../dao';
import { CRUD, BaseObject, Task, TaskTime } from '../interfaces';
import { TaskTimeService } from './task.time.service';

export class TasksService implements CRUD<Task> {
	private static instance: TasksService;
	taskDao: TaskDao;
	taskTimeService: TaskTimeService;

	constructor() {
		this.taskDao = TaskDao.getInstance();
		this.taskTimeService = TaskTimeService.getInstance();
	}

	static getInstance(): TasksService {
		if (!TasksService.instance) TasksService.instance = new TasksService();

		return TasksService.instance;
	}

	create(resource: Task): Task {
		const createdTask = this.taskDao.add<Task>(resource);
		const { timeTable } = createdTask;
		createdTask.timeTable = timeTable ?? [];
		return createdTask;
	}

	deleteById(resouceId: string): BaseObject {
		const taskId = Number(resouceId);

		return this.taskDao.removeById(taskId);
	}

	list(limit = 20, page = 1): Task[] {
		const taskList = this.taskDao.getList<Task>(limit, page);
		return taskList.map((task: Task) => {
			task.timeTable = this.taskTimeService.listByTaskId(task.id);
			return task;
		});
	}

	listByHistoryId(historyId: number): Task[] {
		const taskList = this.taskDao.getList<Task>();
		return taskList.filter((task: Task) => task.historyId === historyId);
	}

	patchById(resourceId: string, resource: Task): Task {
		const taskId = Number(resourceId);
		const { id, finished, name, historyId, timeTable, observation } = resource;
		resource = { ...resource, id: Number(id) };

		if (finished) resource = { ...resource, finished };
		if (name) resource = { ...resource, name };
		if (historyId) resource = { ...resource, historyId };
		if (observation) resource = { ...resource, observation };

		const pachedTask = this.taskDao.patchById<Task>(taskId, resource);

		if (timeTable?.length) {
			pachedTask.timeTable = timeTable.map((taskTime: TaskTime) => {
				taskTime.taskId = pachedTask.id;
				return this.taskTimeService.patchById(String(taskTime.id), taskTime);
			});
		}

		return pachedTask;
	}

	getById(resourceId: string): Task {
		const taskId = Number(resourceId);
		const task = this.taskDao.getById<Task>(taskId);
		if (task) task.timeTable = this.taskTimeService.listByTaskId(task.id);

		return task;
	}

	getByParam(param: string, value: unknown): Task {
		return this.taskDao.getByParams<Task>(param, value);
	}

	updateById(resourceId: string, resource: Task): Task {
		const taskId = Number(resourceId);
		const { id, name, finished, historyId, timeTable, observation } = resource;
		resource = { id: Number(id), name, finished, historyId, observation };

		const updatedTask = this.taskDao.putById<Task>(taskId, resource);

		if (timeTable?.length) {
			updatedTask.timeTable = timeTable.map((taskTime: TaskTime) => {
				taskTime.taskId = updatedTask.id;
				return this.taskTimeService.updateById(String(taskTime.id), taskTime);
			});
		}

		return updatedTask;
	}
}
