import server from '../../server';
import { agent as request, Response } from 'supertest';
import { expect } from 'chai';
import { EnumOfTypes } from '../../api/interfaces';
import { Endpoints, ErrorMsgs, HttpCodes } from '../../api/common';
import { UserMock } from '../../mock';

let firstUserId = 0;

const header = { Authorization: 'Bearer ' };
const { firstUser, secondUser } = UserMock;
const { username, email, password } = firstUser;
const { ARRAY, NUMBER, OBJECT, STRING } = EnumOfTypes;
const { auth, user, users } = Endpoints;
const { BAD_REQUEST, CREATED, OK } = HttpCodes;
const {
	emailExist,
	invalidBody,
	missingEmail,
	missingEmailAndPasswd,
	missingPasswd,
	missingUsername,
	missingUsernameAndEmail,
	missingUsernameAndPasswd,
	usernameExist,
} = ErrorMsgs;

describe('user.post.test', () => {
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

		it('should return 400 - Bad Request - username exists', (done) => {
			request(server)
				.post(user)
				.send({ username, email: secondUser.email, password: secondUser.password })
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
				.post(user)
				.send({ username: secondUser.username, email, password: secondUser.password })
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

		it('should return 400 - Bad Request - missing username', (done) => {
			request(server)
				.post(user)
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
				.post(user)
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
				.post(user)
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
				.post(user)
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
				.post(user)
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
				.post(user)
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
				.post(user)
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

		it('should return 400 - Bad Request - invalid body request', (done) => {
			request(server)
				.post(user)
				.send({ invalid: 'invalid' })
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
