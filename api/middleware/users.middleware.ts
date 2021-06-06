import { NextFunction, Request, Response } from 'express';
import { ErrorMsg, User } from '../interfaces';
import { UsersService } from '../services';
import { ErrorMsgs, HttpCodes } from '../common';
import { Methods } from '../common';

const { emailExist, invalidBody, missingParamId, usernameExist, userNotFound } = ErrorMsgs;
const { BAD_REQUEST, NOT_FOUND } = HttpCodes;
const { PUT } = Methods;

export class UsersMiddleware {
	private static instance: UsersMiddleware;

	static getInstance(): UsersMiddleware {
		if (!UsersMiddleware.instance) UsersMiddleware.instance = new UsersMiddleware();

		return UsersMiddleware.instance;
	}

	extractUserId({ body, params }: Request, res: Response, next: NextFunction): void {
		body.id = params.userId;
		next();
	}

	async validateIdDoesExist({ params }: Request, res: Response, next: NextFunction): Promise<void> {
		const { userId } = params;

		if (!userId) {
			res.status(BAD_REQUEST).send(new ErrorMsg(missingParamId));
		} else {
			const userService = UsersService.getInstance();
			const user = await userService.getById(userId);

			if (user) next();
			else res.status(NOT_FOUND).send(new ErrorMsg(userNotFound));
		}
	}

	validateBodyFields({ body }: Request, res: Response, next: NextFunction): void {
		const { username, email, password } = body;

		if (username || email || password) next();
		else res.status(BAD_REQUEST).send(new ErrorMsg(invalidBody));
	}

	validateRequiredUserBodyFields({ body }: Request, res: Response, next: NextFunction): void {
		const { email, password, username } = body;

		if (body && email && password && username) {
			next();
		} else {
			let errorText = 'Missing required field';
			const errorFields = [];

			if (!username) errorFields.push(' username');
			if (!email) errorFields.push(' email');
			if (!password) errorFields.push(' password');

			const lastField = errorFields.pop();
			errorText += errorFields.length ? `s:${errorFields} and${lastField}` : `:${lastField}`;

			res.status(BAD_REQUEST).send(new ErrorMsg(errorText));
		}
	}

	async validateSameEmailDoesntExist(
		{ body, method, params }: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const userService = UsersService.getInstance();
		const { email } = body;
		const user = await userService.getByParam('email', email);

		if (user) {
			if (method === PUT && Number(params?.userId) === (user as User).id) next();
			else res.status(BAD_REQUEST).send(new ErrorMsg(emailExist));
		} else {
			next();
		}
	}

	async validateSameUsernameDoesntExist(
		{ body, method, params }: Request,
		res: Response,
		next: NextFunction
	): Promise<void> {
		const userService = UsersService.getInstance();
		const { username } = body;
		const user = await userService.getByParam('username', username);

		if (user) {
			if (method === PUT && Number(params?.userId) === (user as User).id) next();
			else res.status(BAD_REQUEST).send(new ErrorMsg(usernameExist));
		} else {
			next();
		}
	}
}
