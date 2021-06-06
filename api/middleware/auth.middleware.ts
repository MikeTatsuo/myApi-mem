import { NextFunction, Request, Response } from 'express';
import { verify, hash } from 'argon2';
import { ErrorMsg, User } from '../interfaces';
import { UsersService } from '../services';
import { ErrorMsgs, HttpCodes } from '../common';

const { invalidEmailPasswd } = ErrorMsgs;
const { BAD_REQUEST } = HttpCodes;

export class AuthMiddleware {
	private static instance: AuthMiddleware;

	static getInstance(): AuthMiddleware {
		if (!AuthMiddleware.instance) AuthMiddleware.instance = new AuthMiddleware();

		return AuthMiddleware.instance;
	}

	validateBodyRequest({ body }: Request, res: Response, next: NextFunction): void {
		const { email, password } = body;

		if (body && email && password) {
			next();
		} else {
			let errorTxt = 'Missing required field';
			const missingFields: string[] = [];

			if (!email) missingFields.push(' email');
			if (!password) missingFields.push(' password');

			const lastField = missingFields.pop();

			errorTxt += missingFields.length ? `s:${missingFields} and${lastField}` : `:${lastField}`;

			res.status(BAD_REQUEST).send(new ErrorMsg(errorTxt));
		}
	}

	async verifyUserPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
		const { email, password } = req.body;
		const userService = UsersService.getInstance();
		const user: User = await userService.getByParam('email', email);
		const errorMsg: ErrorMsg = new ErrorMsg(invalidEmailPasswd);

		if (user) {
			const { id, email, permissionLevel } = user;
			const passwordHash = await hash(user.password as string);
			const requestPassword = Buffer.from(password, 'utf-8');

			const result = await verify(passwordHash, requestPassword);

			if (result) {
				req.body = {
					id,
					email,
					permissionLevel,
					provider: 'email',
				};
				next();
			} else {
				res.status(BAD_REQUEST).send(errorMsg);
			}
		} else {
			res.status(BAD_REQUEST).send(errorMsg);
		}
	}
}
