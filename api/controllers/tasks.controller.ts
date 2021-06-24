import { HttpCodes } from '../common';
import { Request, Response } from 'express';
import { TasksService } from '../services';

const { CREATED, OK } = HttpCodes;

export class TasksController {
	createTask({ body }: Request, res: Response): void {
		const tasksService = TasksService.getInstance();
		const createdTask = tasksService.create(body);

		res.status(CREATED).send(createdTask);
	}

	getTaskById({ params }: Request, res: Response): void {
		const tasksService = TasksService.getInstance();
		const retrievedTask = tasksService.getById(params.taskId);

		res.status(OK).send(retrievedTask);
	}

	listTasks(req: Request, res: Response): void {
		const tasksService = TasksService.getInstance();
		const tasksList = tasksService.list();

		res.status(OK).send(tasksList);
	}

	patch({ body, params }: Request, res: Response): void {
		const tasksService = TasksService.getInstance();
		const patchedTask = tasksService.patchById(params.taskId, body);

		res.status(OK).send(patchedTask);
	}

	put({ body, params }: Request, res: Response): void {
		const tasksService = TasksService.getInstance();
		const updatedUser = tasksService.updateById(params.taskId, body);

		res.status(OK).send(updatedUser);
	}

	removeTask({ params }: Request, res: Response): void {
		const tasksService = TasksService.getInstance();
		const deletedTaskId = tasksService.deleteById(params.taskId);

		res.status(OK).send(deletedTaskId);
	}
}
