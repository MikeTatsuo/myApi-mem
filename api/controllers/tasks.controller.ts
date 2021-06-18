import { HttpCodes } from '../common';
import { Task } from '../interfaces';
import { Request, Response } from 'express';
import { TasksService } from '../services';

const { CREATED, OK } = HttpCodes;

export class TasksController {
	createTask({ body }: Request, res: Response): void {
		const tasksService = TasksService.getInstance();
		const createdTask = tasksService.create(body);
		const formattedTask = tasksService.formatTask(createdTask);

		res.status(CREATED).send(formattedTask);
	}

	getTaskById({ params }: Request, res: Response): void {
		const tasksService = TasksService.getInstance();
		const retrievedTask = tasksService.getById(params.taskId);
		const formattedTask = tasksService.formatTask(retrievedTask);

		res.status(OK).send(formattedTask);
	}

	listTasks(req: Request, res: Response): void {
		const tasksService = TasksService.getInstance();
		const tasksList = tasksService.list();
		const formattedList = tasksList.map((task: Task) => tasksService.formatTask(task));

		res.status(OK).send(formattedList);
	}

	patch({ body, params }: Request, res: Response): void {
		const tasksService = TasksService.getInstance();
		const patchedTask = tasksService.patchById(params.taskId, body);
		const formattedTask = tasksService.formatTask(patchedTask);

		res.status(OK).send(formattedTask);
	}

	put({ body, params }: Request, res: Response): void {
		const tasksService = TasksService.getInstance();
		const updatedUser = tasksService.updateById(params.taskId, body);
		const formattedTask = tasksService.formatTask(updatedUser);

		res.status(OK).send(formattedTask);
	}

	removeTask({ params }: Request, res: Response): void {
		const tasksService = TasksService.getInstance();
		const deletedTaskId = tasksService.deleteById(params.taskId);

		res.status(OK).send(deletedTaskId);
	}
}
