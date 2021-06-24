import server from '../../server';
import { agent as request, Response } from 'supertest';
import { expect } from 'chai';
import { EnumOfTypes } from '../../api/interfaces';
import { Endpoints, ErrorMsgs, HttpCodes } from '../../api/common';
import { UserMock } from '../../mock';

let firstUserId = 0;
let secondUserId = 0;
const invalidUserId = 0;

const header = { Authorization: 'Bearer ' };
const { firstUser, secondUser, thirdUser } = UserMock;
const { username, email, password } = firstUser;
const { ARRAY, NUMBER, OBJECT, STRING } = EnumOfTypes;
const { auth, user, users } = Endpoints;
const { BAD_REQUEST, CREATED, FORBIDDEN, NOT_FOUND, OK, UNAUTHORIZED } = HttpCodes;
const {
	authRequired,
	emailExist,
	invalidBody,
	invalidSignature,
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

describe('user.put.test', () => {
	describe(`POST ${user}`, () => {
		it('should return 201 - Created', (done) => {
			request(server)
				.post(user)
				.send(firstUser)
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

		it('should return 201 - Created - 2nd user', (done) => {
			request(server)
				.post(user)
				.send(secondUser)
				.then(({ status, body }: Response) => {
					const { id } = body;

					expect(status).to.equal(CREATED);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(id).to.be.an(NUMBER);
					expect(body.username).to.be.an(STRING);
					expect(body.username).to.be.equal(secondUser.username);
					expect(body.email).to.be.an(STRING);
					expect(body.email).to.be.equal(secondUser.email);
					expect(body).not.haveOwnProperty('password');

					secondUserId = id;

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
					const { accessToken, refreshToken } = body;

					expect(status).to.equal(CREATED);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(accessToken).to.be.an(STRING);
					expect(refreshToken).to.be.an(STRING);

					header.Authorization += accessToken;
					done();
				})
				.catch(done);
		});
	});

	describe(`PUT ${user}/:userId`, () => {
		it('should return 200 - Ok', (done) => {
			request(server)
				.put(`${user}/${firstUserId}`)
				.set(header)
				.send(thirdUser)
				.then(({ body, status }: Response) => {
					const { id } = body;

					expect(status).to.equal(OK);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(id).to.be.an(NUMBER);
					expect(id).to.be.equal(firstUserId);
					expect(body.username).to.be.an(STRING);
					expect(body.username).to.be.equal(thirdUser.username);
					expect(body.email).to.be.an(STRING);
					expect(body.email).to.be.equal(thirdUser.email);
					expect(body).not.haveOwnProperty('password');

					done();
				})
				.catch(done);
		});

		it('should return 200 - Ok - change only username', (done) => {
			request(server)
				.put(`${user}/${firstUserId}`)
				.set(header)
				.send({ username, email: thirdUser.email, password: thirdUser.password })
				.then(({ body, status }: Response) => {
					const { id } = body;

					expect(status).to.equal(OK);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(id).to.be.an(NUMBER);
					expect(id).to.be.equal(firstUserId);
					expect(body.username).to.be.an(STRING);
					expect(body.username).to.be.equal(username);
					expect(body.email).to.be.an(STRING);
					expect(body.email).to.be.equal(thirdUser.email);
					expect(body).not.haveOwnProperty('password');

					done();
				})
				.catch(done);
		});

		it('should return 200 - Ok - change only email', (done) => {
			request(server)
				.put(`${user}/${firstUserId}`)
				.set(header)
				.send({ username, email, password: thirdUser.password })
				.then(({ body, status }: Response) => {
					const { id } = body;

					expect(status).to.equal(OK);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(id).to.be.an(NUMBER);
					expect(id).to.be.equal(firstUserId);
					expect(body.username).to.be.an(STRING);
					expect(body.username).to.be.equal(username);
					expect(body.email).to.be.an(STRING);
					expect(body.email).to.be.equal(email);
					expect(body).not.haveOwnProperty('password');

					done();
				})
				.catch(done);
		});

		it('should return 403 - Forbidden - invalid JWT', (done) => {
			request(server)
				.put(`${user}/${firstUserId}`)
				.set({ Authorization: `${header.Authorization}123` })
				.send(secondUser)
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
				.put(`${user}/${firstUserId}`)
				.send(secondUser)
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
				.put(`${user}/${firstUserId}`)
				.set(header)
				.send({ username: secondUser.username, email, password: thirdUser.password })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
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
				.put(`${user}/${firstUserId}`)
				.set(header)
				.send({ username, email: secondUser.email, password: thirdUser.password })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
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
				.put(user)
				.set(header)
				.send(secondUser)
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(missingParamId);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - missing username', (done) => {
			request(server)
				.put(`${user}/${firstUserId}`)
				.set(header)
				.send({ email, password })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
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
				.put(`${user}/${firstUserId}`)
				.set(header)
				.send({ username, password })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
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
				.put(`${user}/${firstUserId}`)
				.set(header)
				.send({ email, username })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
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
				.put(`${user}/${firstUserId}`)
				.set(header)
				.send({ password })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
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
				.put(`${user}/${firstUserId}`)
				.set(header)
				.send({ email })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
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
				.put(`${user}/${firstUserId}`)
				.set(header)
				.send({ username })
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(missingEmailAndPasswd);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - empty body', (done) => {
			request(server)
				.put(`${user}/${firstUserId}`)
				.set(header)
				.send()
				.then(({ status, body }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(invalidBody);

					done();
				})
				.catch(done);
		});

		it('should return 404 - Not Found - user not found', (done) => {
			request(server)
				.put(`${user}/${invalidUserId}`)
				.set(header)
				.send(secondUser)
				.then((res: Response) => {
					const { status, body } = res;
					const { error } = body;

					expect(status).to.equal(NOT_FOUND);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(userNotFound);

					done();
				})
				.catch(done);
		});
	});

	describe(`DELETE ${user}/:userId`, () => {
		it('should return 200 - Ok', (done) => {
			request(server)
				.delete(`${user}/${firstUserId}`)
				.set(header)
				.send()
				.then((res: Response) => {
					const { status, body } = res;
					const { id } = body;

					expect(status).to.equal(OK);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(id).to.be.an(NUMBER);
					expect(id).to.be.equal(firstUserId);

					done();
				})
				.catch(done);
		});

		it('should return 200 - Ok - deleting second user', (done) => {
			request(server)
				.delete(`${user}/${secondUserId}`)
				.set(header)
				.send()
				.then((res: Response) => {
					const { status, body } = res;
					const { id } = body;

					expect(status).to.equal(OK);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(id).to.be.an(NUMBER);
					expect(id).to.be.equal(secondUserId);

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

					expect(status).to.equal(OK);
					expect(body).to.be.an(ARRAY);
					expect(body).to.be.empty;

					done();
				})
				.catch(done);
		});
	});
});
