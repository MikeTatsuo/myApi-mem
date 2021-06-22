import server from '../../server';
import { agent as request, Response } from 'supertest';
import { expect } from 'chai';
import { EnumOfTypes } from '../../api/interfaces';
import { Endpoints, HttpCodes } from '../../api/common';

let firstUserId = 0;
let secondUserId = 0;

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

const header = { Authorization: 'Bearer ' };
const { email, password } = firstUserBody;
const { ARRAY, NUMBER, OBJECT, STRING } = EnumOfTypes;
const { users, user, auth } = Endpoints;
const { CREATED, OK } = HttpCodes;

describe('users.test', () => {
	describe(`POST ${user}`, () => {
		it('should return 201 - Created', (done) => {
			request(server)
				.post(user)
				.send(firstUserBody)
				.then(({ status, body }: Response) => {
					const { id } = body;

					expect(status).to.equal(CREATED);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(OBJECT);
					expect(id).to.be.an(NUMBER);

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

	describe(`POST ${user}`, () => {
		const { username, email } = secondUserBody;

		it('should return 201 - Created', (done) => {
			request(server)
				.post(user)
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

	describe(`GET ${user}`, () => {
		it('should return 200 - Ok - 2 Users', (done) => {
			request(server)
				.get(users)
				.set(header)
				.send()
				.then((res: Response) => {
					const { status, body } = res;

					expect(status).to.equal(OK);
					expect(body).not.to.be.empty;
					expect(body).to.be.an(ARRAY);
					expect(body.length).to.be.equal(2);

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

					expect(status).to.be.equals(OK);
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

					expect(status).to.be.equals(OK);
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

					expect(status).to.be.equals(OK);
					expect(body).to.be.an(ARRAY);
					expect(body).to.be.empty;

					done();
				})
				.catch(done);
		});
	});
});
