import server from '../../server';
import { agent as request, Response } from 'supertest';
import { expect } from 'chai';
import { EnumOfTypes } from '../../api/interfaces';
import { Endpoints, HttpCodes } from '../../api/common';
import { UserMock } from '../../mock';

let firstUserId = 0;
let secondUserId = 0;

const header = { Authorization: 'Bearer ' };
const { firstUser, secondUser } = UserMock;
const { username, email, password } = firstUser;
const { ARRAY, NUMBER, OBJECT, STRING } = EnumOfTypes;
const { users, user, auth } = Endpoints;
const { CREATED, OK } = HttpCodes;

describe('users.test', () => {
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
	});

	describe(`POST ${auth}`, () => {
		it('should return 201 - Created', (done) => {
			request(server)
				.post(auth)
				.send({ email, password })
				.then(({ body, status }: Response) => {
					const { accessToken } = body;

					expect(status).to.equal(CREATED);
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
					expect(username).to.be.equal(firstUser.username);
					expect(email).to.be.an(STRING);
					expect(email).to.be.equal(firstUser.email);
					expect(popedUser).not.haveOwnProperty('password');

					done();
				})
				.catch(done);
		});
	});

	describe(`POST ${user}`, () => {
		it('should return 201 - Created - 2nd User', (done) => {
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
