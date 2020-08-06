'use strict';

const assert = require('assert');
const sandbox = require('sinon');

const MsCall = require('@janiscommerce/microservice-call');
const { ApiSession } = require('@janiscommerce/api-session');

const {
	VtexAccountProcesses,
	VtexAccountProcessesError
} = require('../lib');

describe('Vtex-Account-Processes', () => {

	let vtexAccountProcesses;

	const session = new ApiSession({
		userIsDev: true,
		clientCode: 'defaultClient',
		permissions: [],
		locations: [],
		hasAccessToAllLocations: true
	});

	const validAccountId = '5dea9fc691240d00084083f8';
	const validProcess = 'test-process';

	afterEach(() => {
		sandbox.restore();
		vtexAccountProcesses = session.getSessionInstance(VtexAccountProcesses);
	});

	describe('Getters', () => {

		it('Should return service name', () => {

			assert.strictEqual(VtexAccountProcesses.prototype.serviceName, 'vtex-commerce');
		});

		it('Should return service namespace', () => {

			assert.strictEqual(VtexAccountProcesses.prototype.serviceNamespace, 'account-process');
		});

		it('Should return service method', () => {

			assert.strictEqual(VtexAccountProcesses.prototype.serviceMethod, 'update');
		});

		it('Should return statuses available', () => {

			assert.deepStrictEqual(VtexAccountProcesses.statuses, {
				pending: 'pending',
				processing: 'processing',
				success: 'success',
				error: 'error'
			});
		});
	});

	describe('Send', () => {

		context('When parameters are invalid or missing', () => {

			[
				['Accounts Ids', [], VtexAccountProcessesError.codes.INVALID_ACCOUNTS_ID],
				['Process Name', [validAccountId], VtexAccountProcessesError.codes.INVALID_PROCESS_NAME],
				['Status', [validAccountId, validProcess], VtexAccountProcessesError.codes.INVALID_STATUS]
			].forEach(([fieldName, params, errorCode]) => {

				it(`Should reject if ${fieldName} is not passed`, async () => {

					sandbox.stub(MsCall.prototype, 'safeCall');

					await assert.rejects(vtexAccountProcesses.send(...params), { code: errorCode });

					sandbox.assert.notCalled(MsCall.prototype.safeCall);
				});
			});

			[
				['Account Id', [1, validProcess, VtexAccountProcesses.statuses.pending], VtexAccountProcessesError.codes.INVALID_ACCOUNTS_ID],
				['Process Name', [validAccountId, 1], VtexAccountProcessesError.codes.INVALID_PROCESS_NAME],
				['Status', [validAccountId, validProcess, 'testing'], VtexAccountProcessesError.codes.INVALID_STATUS],
				['Content', [validAccountId, validProcess, VtexAccountProcesses.statuses.pending, 'Message'], VtexAccountProcessesError.codes.INVALID_CONTENT],
				['Options', [validAccountId, validProcess, VtexAccountProcesses.statuses.pending, null, true], VtexAccountProcessesError.codes.INVALID_OPTIONS]
			].forEach(([fieldName, params, errorCode]) => {

				it(`Should reject if ${fieldName} is invalid`, async () => {

					sandbox.stub(MsCall.prototype, 'safeCall');

					await assert.rejects(vtexAccountProcesses.send(...params), { code: errorCode });

					sandbox.assert.notCalled(MsCall.prototype.safeCall);
				});
			});
		});

		context('When parameters are valid', () => {

			const basicParams = [
				validAccountId,
				validProcess,
				VtexAccountProcesses.statuses.pending
			];

			const vtexCommerceAccountProcessId = '5dea9fc691240d0008408300';

			const makeMsCallResponse = (statusCode, body) => ({
				statusCode,
				body
			});

			it('Should reject if No Session is found', async () => {

				const vtexAccountProcessesWithoutSession = new VtexAccountProcesses();

				sandbox.stub(MsCall.prototype, 'safeCall');

				await assert.rejects(vtexAccountProcessesWithoutSession.send(...basicParams), { code: VtexAccountProcessesError.codes.NO_SESSION });

				sandbox.assert.notCalled(MsCall.prototype.safeCall);
			});

			it('Should call Vtex-Commerce API with minimal fields', async () => {

				sandbox.stub(MsCall.prototype, 'safeCall').returns(makeMsCallResponse(200, { id: vtexCommerceAccountProcessId }));

				assert.deepStrictEqual(await vtexAccountProcesses.send(...basicParams), { statusCode: 200, body: { id: vtexCommerceAccountProcessId } });

				sandbox.assert.calledOnceWithExactly(MsCall.prototype.safeCall, 'vtex-commerce', 'account-process', 'update', {
					process: validProcess,
					status: VtexAccountProcesses.statuses.pending
				}, null, { id: validAccountId });
			});

			it('Should call Vtex-Commerce API with content', async () => {

				sandbox.stub(MsCall.prototype, 'safeCall').returns(makeMsCallResponse(200, { id: vtexCommerceAccountProcessId }));

				assert.deepStrictEqual(await vtexAccountProcesses.send(...basicParams, { message: 'Ok' }),
					{ statusCode: 200, body: { id: vtexCommerceAccountProcessId } });

				sandbox.assert.calledOnceWithExactly(MsCall.prototype.safeCall, 'vtex-commerce', 'account-process', 'update', {
					process: validProcess,
					status: VtexAccountProcesses.statuses.pending,
					content: { message: 'Ok' }
				}, null, { id: validAccountId });
			});

			it('Should call Vtex-Commerce API with Start Date Option', async () => {

				sandbox.stub(MsCall.prototype, 'safeCall').returns(makeMsCallResponse(200, { id: vtexCommerceAccountProcessId }));

				assert.deepStrictEqual(await vtexAccountProcesses.send(...basicParams, null, { startDate: true }),
					{ statusCode: 200, body: { id: vtexCommerceAccountProcessId } });

				sandbox.assert.calledOnceWithExactly(MsCall.prototype.safeCall, 'vtex-commerce', 'account-process', 'update', {
					process: validProcess,
					status: VtexAccountProcesses.statuses.pending,
					startDate: sandbox.match.date
				}, null, { id: validAccountId });
			});

			it('Should call Vtex-Commerce API with End Date Option', async () => {

				sandbox.stub(MsCall.prototype, 'safeCall').returns(makeMsCallResponse(200, { id: vtexCommerceAccountProcessId }));

				assert.deepStrictEqual(await vtexAccountProcesses.send(...basicParams, null, { endDate: true }),
					{ statusCode: 200, body: { id: vtexCommerceAccountProcessId } });

				sandbox.assert.calledOnceWithExactly(MsCall.prototype.safeCall, 'vtex-commerce', 'account-process', 'update', {
					process: validProcess,
					status: VtexAccountProcesses.statuses.pending,
					endDate: sandbox.match.date
				}, null, { id: validAccountId });
			});

			it('Should call Vtex-Commerce API with minimal fields if Options has an invalid field', async () => {

				sandbox.stub(MsCall.prototype, 'safeCall').returns(makeMsCallResponse(200, { id: vtexCommerceAccountProcessId }));

				assert.deepStrictEqual(await vtexAccountProcesses.send(...basicParams, null, { makeMagic: true }),
					{ statusCode: 200, body: { id: vtexCommerceAccountProcessId } });

				sandbox.assert.calledOnceWithExactly(MsCall.prototype.safeCall, 'vtex-commerce', 'account-process', 'update', {
					process: validProcess,
					status: VtexAccountProcesses.statuses.pending
				}, null, { id: validAccountId });
			});

			it('Should call Vtex-Commerce API with full fields', async () => {

				sandbox.stub(MsCall.prototype, 'safeCall').returns(makeMsCallResponse(200, { id: vtexCommerceAccountProcessId }));

				assert.deepStrictEqual(await vtexAccountProcesses.send(...basicParams, { message: 'Ok' }, { startDate: true, endDate: true }),
					{ statusCode: 200, body: { id: vtexCommerceAccountProcessId } });

				sandbox.assert.calledOnceWithExactly(MsCall.prototype.safeCall, 'vtex-commerce', 'account-process', 'update', {
					process: validProcess,
					status: VtexAccountProcesses.statuses.pending,
					content: { message: 'Ok' },
					startDate: sandbox.match.date,
					endDate: sandbox.match.date
				}, null, { id: validAccountId });
			});

			it('Should return 404 as reponse if Account is not found in Vtex-Commerce', async () => {

				sandbox.stub(MsCall.prototype, 'safeCall').returns(makeMsCallResponse(404, { message: 'Account not found' }));

				assert.deepStrictEqual(await vtexAccountProcesses.send(...basicParams), { statusCode: 404, body: { message: 'Account not found' } });

				sandbox.assert.calledOnceWithExactly(MsCall.prototype.safeCall, 'vtex-commerce', 'account-process', 'update', {
					process: validProcess,
					status: VtexAccountProcesses.statuses.pending
				}, null, { id: validAccountId });
			});

			it('Should return 500 as reponse if Vtex-Commerce fails', async () => {

				sandbox.stub(MsCall.prototype, 'safeCall').returns(makeMsCallResponse(500, { message: 'Account not found' }));

				assert.deepStrictEqual(await vtexAccountProcesses.send(...basicParams), { statusCode: 500, body: { message: 'Account not found' } });

				sandbox.assert.calledOnceWithExactly(MsCall.prototype.safeCall, 'vtex-commerce', 'account-process', 'update', {
					process: validProcess,
					status: VtexAccountProcesses.statuses.pending
				}, null, { id: validAccountId });
			});
		});
	});
});
