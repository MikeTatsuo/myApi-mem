import { HttpCodes } from '../common';
import { User } from '../interfaces';
import { Request, Response } from 'express';
import { UsersService } from '../services';

const { CREATED, OK } = HttpCodes;

export class UsersController {
	createUser({ body }: Request, res: Response): void {
		const userService = UsersService.getInstance();
		const createdUser = userService.create(body);
		const formattedUser = userService.formatUser(createdUser);

		res.status(CREATED).send(formattedUser);
	}

	getUserById({ params }: Request, res: Response): void {
		const userService = UsersService.getInstance();
		const retrievedUser = userService.getById(params.userId);
		const formattedUser = userService.formatUser(retrievedUser);

		res.status(OK).send(formattedUser);
	}

	listUsers(req: Request, res: Response): void {
		const userService = UsersService.getInstance();
		const usersList = userService.list();
		const formattedList = usersList.map((user: User) => userService.formatUser(user));

		res.status(OK).send(formattedList);
	}

	patch({ body, params }: Request, res: Response): void {
		const userService = UsersService.getInstance();
		const patchedUser = userService.patchById(params.userId, body);
		const formattedUser = userService.formatUser(patchedUser);

		res.status(OK).send(formattedUser);
	}

	put({ body, params }: Request, res: Response): void {
		const userService = UsersService.getInstance();
		const updatedUser = userService.updateById(params.userId, body);
		const formattedUser = userService.formatUser(updatedUser);

		res.status(OK).send(formattedUser);
	}

	removeUser({ params }: Request, res: Response): void {
		const userService = UsersService.getInstance();
		const deletedUserId = userService.deleteById(params.userId);

		res.status(OK).send(deletedUserId);
	}
}
