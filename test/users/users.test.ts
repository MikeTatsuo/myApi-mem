import server from '../../server';
import { agent as request, Response } from 'supertest';
import { expect } from 'chai';
import { EnumOfTypes } from '../../api/interfaces';
import { Endpoints, ErrorMsgs, HttpCodes } from '../../api/common';

let firstUserId = 0;
let secondUserId = 0;
const invalidUserId = 0;

const firstUserBody = {
	username: 'Username 1',
	email: 'email@1.com',
	password: 'Password1',
};

const secondUserBody = {
	username: 'Username 2',
	email: 'email@2.com',
	password: 'Password2',
};

const thirdUserBody = {
	username: 'Username 3',
	email: 'email@3.com',
	password: 'Password3',
};

const header = { Authorization: 'Bearer ' };
const { username, email, password } = firstUserBody;
const { ARRAY, NUMBER, OBJECT, STRING } = EnumOfTypes;
const { users, auth } = Endpoints;
const { BAD_REQUEST, CREATED, FORBIDDEN, NOT_FOUND, OK, UNAUTHORIZED } = HttpCodes;
const {
	authRequired,
	emailExist,
	invalidBody,
	invalidSignature,
	missingAll,
	missingEmail,
	missingEmailAndPasswd,
	missingParamId,
	missingPasswd,
	missingUsername,
	missingUsernameAndEmail,
	missingUsernameAndPasswd,
	usernameExist,
	userNotFound,
} = ErrorMsgs;

describe('users.test', () => {
	describe(`POST ${users}`, () => {
		it('should return 201 - Created', (done) => {
			request(server)
				.post(users)
				.send(firstUserBody)
				.then(({ status, body }: Response) => {
					const { id } = body;

					expect(status).to.equal(CREATED);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(id).to.be.an(NUMBER);
					expect(body.username).to.be.an(STRING);
					expect(body.username).to.be.equal(username);
					expect(body.email).to.be.an(STRING);
					expect(body.email).to.be.equal(email);
					expect(body).not.haveOwnProperty('password');

					firstUserId = id;

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - username exists', (done) => {
			request(server)
				.post(users)
				.send({ username, email: secondUserBody.email, password: secondUserBody.password })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.be.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(usernameExist);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - email exists', (done) => {
			request(server)
				.post(users)
				.send({ username: secondUserBody.username, email, password: secondUserBody.password })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.be.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(emailExist);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - missing username', (done) => {
			request(server)
				.post(users)
				.send({ email, password })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.be.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(missingUsername);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - missing email', (done) => {
			request(server)
				.post(users)
				.send({ username, password })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.be.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(missingEmail);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - missing password', (done) => {
			request(server)
				.post(users)
				.send({ email, username })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.be.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(missingPasswd);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - missing username and email', (done) => {
			request(server)
				.post(users)
				.send({ password })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.be.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(missingUsernameAndEmail);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - missing username and password', (done) => {
			request(server)
				.post(users)
				.send({ email })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.be.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(missingUsernameAndPasswd);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - missing email and password', (done) => {
			request(server)
				.post(users)
				.send({ username })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.be.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(missingEmailAndPasswd);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - missing username, email and password', (done) => {
			request(server)
				.post(users)
				.send()
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.be.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(missingAll);

					done();
				})
				.catch(done);
		});
	});

	describe(`POST ${auth}`, () => {
		it('should return 201 - Created', (done) => {
			request(server)
				.post(auth)
				.send({ email, password })
				.then(({ body, status }: Response) => {
					const { accessToken } = body;

					expect(status).to.be.equal(CREATED);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(accessToken).to.be.an(STRING);

					header.Authorization += accessToken;
					done();
				})
				.catch(done);
		});
	});

	describe(`GET ${users}/:userId`, () => {
		it('should return 200 - Ok', (done) => {
			request(server)
				.get(`${users}/${firstUserId}`)
				.set(header)
				.send()
				.then(({ body, status }: Response) => {
					const { id, username, email } = body;

					expect(status).to.equal(OK);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(id).to.be.an(NUMBER);
					expect(username).to.be.equals(firstUserBody.username);
					expect(email).to.be.equals(firstUserBody.email);
					expect(body).not.haveOwnProperty('password');

					done();
				})
				.catch(done);
		});

		it('should return 403 - Forbidden - invalid JWT', (done) => {
			request(server)
				.get(`${users}/${firstUserId}`)
				.set({ Authorization: `${header.Authorization}123` })
				.send()
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(FORBIDDEN);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(invalidSignature);

					done();
				})
				.catch(done);
		});

		it('should return 401 - Unauthorized - no JWT set', (done) => {
			request(server)
				.get(`${users}/${firstUserId}`)
				.send()
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(UNAUTHORIZED);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(authRequired);

					done();
				})
				.catch(done);
		});

		it('should return 404 - Not Found - user not found', (done) => {
			request(server)
				.get(`${users}/${invalidUserId}`)
				.set(header)
				.send()
				.then((res: Response) => {
					const { status, body } = res;
					const { error } = body;

					expect(status).to.equal(NOT_FOUND);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equals(userNotFound);

					done();
				})
				.catch(done);
		});
	});

	describe(`GET ${users}`, () => {
		it('should return 200 - Ok', (done) => {
			request(server)
				.get(users)
				.set(header)
				.send()
				.then((res: Response) => {
					const { status, body } = res;

					expect(status).to.equal(OK);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(ARRAY);

					const popedUser = body.pop();
					const { id, username, email } = popedUser;

					expect(id).to.be.an(NUMBER);
					expect(username).to.be.an(STRING);
					expect(username).to.be.equals(firstUserBody.username);
					expect(email).to.be.an(STRING);
					expect(email).to.be.equals(firstUserBody.email);
					expect(popedUser).not.haveOwnProperty('password');

					done();
				})
				.catch(done);
		});
	});

	describe(`POST ${users}`, () => {
		const { username, email } = secondUserBody;

		it('should return 201 - Created', (done) => {
			request(server)
				.post(users)
				.send(secondUserBody)
				.then(({ status, body }: Response) => {
					const { id } = body;

					expect(status).to.equal(CREATED);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(id).to.be.an(NUMBER);
					expect(body.username).to.be.an(STRING);
					expect(body.username).to.be.equal(username);
					expect(body.email).to.be.an(STRING);
					expect(body.email).to.be.equal(email);
					expect(body).not.haveOwnProperty('password');

					secondUserId = id;

					done();
				})
				.catch(done);
		});
	});

	describe(`PUT ${users}/:userId`, () => {
		const { username, email, password } = thirdUserBody;

		it('should return 200 - Ok', (done) => {
			request(server)
				.put(`${users}/${firstUserId}`)
				.set(header)
				.send(thirdUserBody)
				.then(({ body, status }: Response) => {
					const { id } = body;

					expect(status).to.be.equals(OK);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(id).to.be.an(NUMBER);
					expect(id).to.be.equal(firstUserId);
					expect(body.username).to.be.an(STRING);
					expect(body.username).to.be.equals(username);
					expect(body.email).to.be.an(STRING);
					expect(body.email).to.be.equals(email);
					expect(body).not.haveOwnProperty('password');

					done();
				})
				.catch(done);
		});

		it('should return 200 - Ok - change only username', (done) => {
			request(server)
				.put(`${users}/${firstUserId}`)
				.set(header)
				.send({ username: firstUserBody.username, email, password })
				.then(({ body, status }: Response) => {
					const { id } = body;

					expect(status).to.be.equals(OK);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(id).to.be.an(NUMBER);
					expect(id).to.be.equal(firstUserId);
					expect(body.username).to.be.an(STRING);
					expect(body.username).to.be.equals(firstUserBody.username);
					expect(body.email).to.be.an(STRING);
					expect(body.email).to.be.equals(email);
					expect(body).not.haveOwnProperty('password');

					done();
				})
				.catch(done);
		});

		it('should return 200 - Ok - change only email', (done) => {
			request(server)
				.put(`${users}/${firstUserId}`)
				.set(header)
				.send({ username: firstUserBody.username, email: firstUserBody.email, password })
				.then(({ body, status }: Response) => {
					const { id } = body;

					expect(status).to.be.equals(OK);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(id).to.be.an(NUMBER);
					expect(id).to.be.equal(firstUserId);
					expect(body.username).to.be.an(STRING);
					expect(body.username).to.be.equals(firstUserBody.username);
					expect(body.email).to.be.an(STRING);
					expect(body.email).to.be.equals(firstUserBody.email);
					expect(body).not.haveOwnProperty('password');

					done();
				})
				.catch(done);
		});

		it('should return 403 - Forbidden - invalid JWT', (done) => {
			request(server)
				.put(`${users}/${firstUserId}`)
				.set({ Authorization: `${header.Authorization}123` })
				.send(secondUserBody)
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(FORBIDDEN);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(invalidSignature);

					done();
				})
				.catch(done);
		});

		it('should return 401 - Unauthorized - no JWT set', (done) => {
			request(server)
				.put(`${users}/${firstUserId}`)
				.send(secondUserBody)
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(UNAUTHORIZED);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(authRequired);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - username exists', (done) => {
			request(server)
				.put(`${users}/${firstUserId}`)
				.set(header)
				.send({ username: secondUserBody.username, email, password })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.be.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(usernameExist);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - email exists', (done) => {
			request(server)
				.put(`${users}/${firstUserId}`)
				.set(header)
				.send({ username, email: secondUserBody.email, password })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.be.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(emailExist);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - missing param id', (done) => {
			request(server)
				.put(users)
				.set(header)
				.send(secondUserBody)
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equals(missingParamId);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - missing username', (done) => {
			request(server)
				.put(`${users}/${firstUserId}`)
				.set(header)
				.send({ email, password })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.be.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(missingUsername);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - missing email', (done) => {
			request(server)
				.put(`${users}/${firstUserId}`)
				.set(header)
				.send({ username, password })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.be.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(missingEmail);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - missing password', (done) => {
			request(server)
				.put(`${users}/${firstUserId}`)
				.set(header)
				.send({ email, username })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.be.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(missingPasswd);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - missing username and email', (done) => {
			request(server)
				.put(`${users}/${firstUserId}`)
				.set(header)
				.send({ password })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.be.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(missingUsernameAndEmail);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - missing username and password', (done) => {
			request(server)
				.put(`${users}/${firstUserId}`)
				.set(header)
				.send({ email })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.be.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(missingUsernameAndPasswd);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - missing email and password', (done) => {
			request(server)
				.put(`${users}/${firstUserId}`)
				.set(header)
				.send({ username })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.be.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(missingEmailAndPasswd);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - missing username, email and password', (done) => {
			request(server)
				.put(`${users}/${firstUserId}`)
				.set(header)
				.send()
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.be.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(missingAll);

					done();
				})
				.catch(done);
		});

		it('should return 404 - Not Found - user not found', (done) => {
			request(server)
				.put(`${users}/${invalidUserId}`)
				.set(header)
				.send(secondUserBody)
				.then((res: Response) => {
					const { status, body } = res;
					const { error } = body;

					expect(status).to.equal(NOT_FOUND);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equals(userNotFound);

					done();
				})
				.catch(done);
		});
	});

	describe(`PATCH ${users}/:userId`, () => {
		const { username, email } = thirdUserBody;

		it('should return 200 - Ok - patching username', (done) => {
			request(server)
				.patch(`${users}/${firstUserId}`)
				.set(header)
				.send({ username })
				.then(({ body, status }: Response) => {
					const { id } = body;

					expect(status).to.be.equals(OK);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(id).to.be.an(NUMBER);
					expect(id).to.be.equal(firstUserId);
					expect(body.email).to.be.an(STRING);
					expect(body.email).to.be.equal(firstUserBody.email);
					expect(body.username).to.be.an(STRING);
					expect(body.username).to.be.equals(username);
					expect(body).not.haveOwnProperty('password');

					done();
				})
				.catch(done);
		});

		it('should return 200 - Ok - patching email', (done) => {
			request(server)
				.patch(`${users}/${firstUserId}`)
				.set(header)
				.send({ email })
				.then(({ body, status }: Response) => {
					const { id } = body;

					expect(status).to.be.equals(OK);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(id).to.be.an(NUMBER);
					expect(id).to.be.equal(firstUserId);
					expect(body.email).to.be.an(STRING);
					expect(body.email).to.be.equal(email);
					expect(body.username).to.be.an(STRING);
					expect(body.username).to.be.equals(username);
					expect(body).not.haveOwnProperty('password');

					done();
				})
				.catch(done);
		});

		it('should return 200 - Ok - patching password', (done) => {
			request(server)
				.patch(`${users}/${firstUserId}`)
				.set(header)
				.send({ password })
				.then(({ body, status }: Response) => {
					const { id } = body;

					expect(status).to.be.equals(OK);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(id).to.be.an(NUMBER);
					expect(id).to.be.equal(firstUserId);
					expect(body.email).to.be.an(STRING);
					expect(body.email).to.be.equal(email);
					expect(body.username).to.be.an(STRING);
					expect(body.username).to.be.equals(username);
					expect(body).not.haveOwnProperty('password');

					done();
				})
				.catch(done);
		});

		it('should return 403 - Forbidden - invalid JWT', (done) => {
			request(server)
				.patch(`${users}/${firstUserId}`)
				.set({ Authorization: `${header.Authorization}123` })
				.send(secondUserBody)
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(FORBIDDEN);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(invalidSignature);

					done();
				})
				.catch(done);
		});

		it('should return 401 - Unauthorized - no JWT set', (done) => {
			request(server)
				.patch(`${users}/${firstUserId}`)
				.send(secondUserBody)
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(UNAUTHORIZED);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(authRequired);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - empty body', (done) => {
			request(server)
				.patch(`${users}/${firstUserId}`)
				.set(header)
				.send()
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equals(invalidBody);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - username exists', (done) => {
			request(server)
				.patch(`${users}/${firstUserId}`)
				.set(header)
				.send({ username: secondUserBody.username })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.be.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(usernameExist);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - email exists', (done) => {
			request(server)
				.patch(`${users}/${firstUserId}`)
				.set(header)
				.send({ email: secondUserBody.email })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.be.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(emailExist);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - invalid body request', (done) => {
			request(server)
				.patch(`${users}/${firstUserId}`)
				.set(header)
				.send({ teste: 'teste' })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.be.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(invalidBody);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - missing param id', (done) => {
			request(server)
				.patch(users)
				.set(header)
				.send({ username })
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equals(missingParamId);

					done();
				})
				.catch(done);
		});

		it('should return 404 - Not Found - user not found', (done) => {
			request(server)
				.patch(`${users}/${invalidUserId}`)
				.set(header)
				.send(username)
				.then((res: Response) => {
					const { status, body } = res;
					const { error } = body;

					expect(status).to.equal(NOT_FOUND);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equals(userNotFound);

					done();
				})
				.catch(done);
		});
	});

	describe(`DELETE ${users}/:userId`, () => {
		it('should return 200 - Ok', (done) => {
			request(server)
				.delete(`${users}/${firstUserId}`)
				.set(header)
				.send()
				.then((res: Response) => {
					const { status, body } = res;
					const { id } = body;

					expect(status).to.be.equals(OK);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(id).to.be.an(NUMBER);
					expect(id).to.be.equal(firstUserId);

					done();
				})
				.catch(done);
		});

		it('should return 403 - Forbidden - invalid JWT', (done) => {
			request(server)
				.delete(`${users}/${firstUserId}`)
				.set({ Authorization: `${header.Authorization}123` })
				.send(secondUserBody)
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(FORBIDDEN);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(invalidSignature);

					done();
				})
				.catch(done);
		});

		it('should return 401 - Unauthorized - no JWT set', (done) => {
			request(server)
				.delete(`${users}/${firstUserId}`)
				.send(secondUserBody)
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(UNAUTHORIZED);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(authRequired);

					done();
				})
				.catch(done);
		});

		it('should return 200 - Ok - deleting second user', (done) => {
			request(server)
				.delete(`${users}/${secondUserId}`)
				.set(header)
				.send()
				.then((res: Response) => {
					const { status, body } = res;
					const { id } = body;

					expect(status).to.be.equals(OK);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(id).to.be.an(NUMBER);
					expect(id).to.be.equal(secondUserId);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - missing param id', (done) => {
			request(server)
				.delete(users)
				.set(header)
				.send()
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equals(missingParamId);

					done();
				})
				.catch(done);
		});

		it('should return 404 - Not Found - user not found', (done) => {
			request(server)
				.delete(`${users}/${invalidUserId}`)
				.set(header)
				.send()
				.then((res: Response) => {
					const { status, body } = res;
					const { error } = body;

					expect(status).to.equal(NOT_FOUND);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equals(userNotFound);

					done();
				})
				.catch(done);
		});
	});

	describe(`GET ${users}`, () => {
		it('should return 200 - Ok - and body to be empty', (done) => {
			request(server)
				.get(users)
				.set(header)
				.send()
				.then((res: Response) => {
					const { status, body } = res;

					expect(status).to.be.equals(OK);
					expect(body).to.be.an(ARRAY);
					expect(body).to.be.empty;

					done();
				})
				.catch(done);
		});
	});
});
