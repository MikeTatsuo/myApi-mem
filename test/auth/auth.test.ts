import server from '../../server';
import { agent as request, Response } from 'supertest';
import { expect } from 'chai';
import { Endpoints, ErrorMsgs, HttpCodes } from '../../api/common';
import { EnumOfTypes } from '../../api/interfaces';

let firstUserId = 0;

const firstUserBody = {
	username: 'Username 1',
	email: 'user@1.com',
	password: 'Password1',
};

const invalidUserBody = {
	email: 'invalid@user.com',
	password: 'invalidPassword',
};

let jwt = {
	accessToken: '',
	refreshToken: '',
};

const header = { Authorization: 'Bearer ' };
const { username, email, password } = firstUserBody;
const { auth, authRefresh, users } = Endpoints;
const { OBJECT, NUMBER, STRING } = EnumOfTypes;
const { BAD_REQUEST, CREATED, FORBIDDEN, OK, UNAUTHORIZED } = HttpCodes;
const {
	authRequired,
	invalidAuthType,
	invalidEmailPasswd,
	invalidRefreshToken,
	invalidSignature,
	missingEmail,
	missingPasswd,
	missingEmailAndPasswd,
	missingRefreshToken,
} = ErrorMsgs;

describe('auth.test', () => {
	describe(`POST ${users}`, () => {
		it('should return 201 - Created', (done) => {
			request(server)
				.post(users)
				.send(firstUserBody)
				.then(({ body, status }: Response) => {
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

					jwt = { accessToken, refreshToken };
					header.Authorization += accessToken;
					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - missing email', (done) => {
			request(server)
				.post(auth)
				.send({ password })
				.then(({ body, status }: Response) => {
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
				.post(auth)
				.send({ email })
				.then(({ body, status }: Response) => {
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

		it('should return 400 - Bad Request - missing email and password', (done) => {
			request(server)
				.post(auth)
				.send()
				.then(({ body, status }: Response) => {
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

		it('should return 400 - Bad Request - invalid email', (done) => {
			request(server)
				.post(auth)
				.send({ email: invalidUserBody.email, password })
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(invalidEmailPasswd);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - invalid password', (done) => {
			request(server)
				.post(auth)
				.send({ email, password: invalidUserBody.password })
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(invalidEmailPasswd);

					done();
				})
				.catch(done);
		});
	});

	describe(`POST ${auth}${authRefresh}`, () => {
		it('should return 403 - Forbidden - invalid JWT', (done) => {
			const { refreshToken } = jwt;

			request(server)
				.post(`${auth}${authRefresh}`)
				.set({ Authorization: `${header.Authorization}123` })
				.send({ refreshToken })
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
			const { refreshToken } = jwt;

			request(server)
				.post(`${auth}${authRefresh}`)
				.send({ refreshToken })
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

		it('should return 401 - Unauthorized - invalid auth type', (done) => {
			const { refreshToken } = jwt;
			request(server)
				.post(`${auth}${authRefresh}`)
				.set({ Authorization: `WrongAuth ${jwt.accessToken}` })
				.send({ refreshToken })
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(UNAUTHORIZED);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(invalidAuthType);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - invalid refreshToken', (done) => {
			request(server)
				.post(`${auth}${authRefresh}`)
				.set(header)
				.send({ refreshToken: '123' })
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(invalidRefreshToken);

					done();
				})
				.catch(done);
		});

		it('should return 400 - Bad Request - no refreshToken', (done) => {
			request(server)
				.post(`${auth}${authRefresh}`)
				.set(header)
				.send()
				.then(({ body, status }: Response) => {
					const { error } = body;

					expect(status).to.equal(BAD_REQUEST);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(error).to.be.an(STRING);
					expect(error).to.be.equal(missingRefreshToken);

					done();
				})
				.catch(done);
		});

		it('should return 201 - Created', (done) => {
			const { refreshToken } = jwt;

			request(server)
				.post(`${auth}${authRefresh}`)
				.set(header)
				.send({ refreshToken })
				.then(({ body, status }: Response) => {
					expect(status).to.equal(CREATED);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(body.accessToken).to.be.an(STRING);
					expect(body.refreshToken).to.be.an(STRING);

					jwt = { accessToken: body.accessToken, refreshToken: body.refreshToken };
					header.Authorization = `Bearer ${body.accessToken}`;

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
				.then(({ body, status }: Response) => {
					const { id } = body;

					expect(status).to.be.equals(OK);
					expect(body).to.not.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(id).to.be.an(NUMBER);
					expect(id).to.be.equal(firstUserId);

					done();
				})
				.catch(done);
		});
	});
});
