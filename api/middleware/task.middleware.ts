import { NextFunction, Request, Response } from 'express';
import { EnumOfTypes, ErrorMsg, Task } from '../interfaces';
import { TasksService } from '../services';
import { ErrorMsgs, HttpCodes } from '../common';
import { Methods } from '../common';

const { invalidBody, missingParamId, taskExist, taskNotFound, unableToDeleteTask } = ErrorMsgs;
const { BAD_REQUEST, CONFLICT, NOT_FOUND } = HttpCodes;
const { DELETE, PUT } = Methods;
const { BOOLEAN } = EnumOfTypes;

export class TasksMiddleware {
	private static instance: TasksMiddleware;

	static getInstance(): TasksMiddleware {
		if (!TasksMiddleware.instance) TasksMiddleware.instance = new TasksMiddleware();

		return TasksMiddleware.instance;
	}

	extractTaskId({ body, params }: Request, res: Response, next: NextFunction): void {
		body.id = params.taskId;
		next();
	}

	async validateIdDoesExist({ params }: Request, res: Response, next: NextFunction): Promise<void> {
		const { taskId } = params;

		if (!taskId) {
			res.status(BAD_REQUEST).send(new ErrorMsg(missingParamId));
		} else {
			const tasksService = TasksService.getInstance();
			const task = await tasksService.getById(taskId);
			if (task) next();
			else res.status(NOT_FOUND).send(new ErrorMsg(taskNotFound));
		}
	}

	validateBodyFields({ body }: Request, res: Response, next: NextFunction): void {
		const { finished, name, observation, timeTable } = body;

		if (name || finished || observation || timeTable) next();
		else res.status(BAD_REQUEST).send(new ErrorMsg(invalidBody));
	}

	validateRequiredTaskBodyFields({ body }: Request, res: Response, next: NextFunction): void {
		const { finished, name } = body;

		if (body && name && typeof finished === BOOLEAN) {
			next();
		} else {
			let errorText = 'Missing required field';
			const errorFields = [];

			if (!name) errorFields.push(' name');
			if (typeof finished !== BOOLEAN) errorFields.push(' finished');

			const lastField = errorFields.pop();
			errorText += errorFields.length ? `s:${errorFields} and${lastField}` : `:${lastField}`;

			res.status(BAD_REQUEST).send(new ErrorMsg(errorText));
		}
	}

	async validateSameNameDoesntExist(
		{ body, method, params }: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const tasksService = TasksService.getInstance();
		const { name } = body;
		const task = await tasksService.getByParam('name', name);

		if (task) {
			if (method === PUT && Number(params?.taskId) === (task as Task).id) next();
			else res.status(BAD_REQUEST).send(new ErrorMsg(taskExist));
		} else {
			next();
		}
	}

	async validateCanBeDeleted(
		{ method, params }: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const tasksService = TasksService.getInstance();
		const { taskId } = params;
		const task = await tasksService.getById(taskId);

		if (task) {
			const timeTableLength = task.timeTable?.length;
			if (method === DELETE && timeTableLength) res.status(CONFLICT).send(unableToDeleteTask);
			else next();
		} else {
			res.status(NOT_FOUND).send(new ErrorMsg(taskNotFound));
		}
	}
}
