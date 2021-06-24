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
const { auth, authRefresh, user } = Endpoints;
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

describe('auth.post.test', () => {
	describe(`POST ${user}`, () => {
		it('should return 201 - Created', (done) => {
			request(server)
				.post(user)
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

	describe(`DELETE ${user}/:userId`, () => {
		it('should return 200 - Ok', (done) => {
			request(server)
				.delete(`${user}/${firstUserId}`)
				.set(header)
				.send()
				.then(({ body, status }: Response) => {
					const { id } = body;

					expect(status).to.equal(OK);
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