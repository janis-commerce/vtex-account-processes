'use strict';

const MsCall = require('@janiscommerce/microservice-call');

const { validateParams, isString } = require('./helper/validate');

module.exports = class VtexAccountProcesses {

	static get statuses() {
		return {
			pending: 'pending',
			processing: 'processing',
			success: 'success',
			error: 'error'
		};
	}

	get serviceName() {
		return 'vtex-commerce';
	}

	get serviceNamespace() {
		return 'account-process';
	}

	get serviceMethod() {
		return 'update';
	}

	/**
	 * Send new Date to Account-process in VTEX-Commerce Service
	 * @async
	 * @param {string[]|string} accounts Account ID or Array of Accounts IDs
	 * @param {string} processName Process Name
	 * @param {string} newStatus Status
	 * @param {object=} content Extra Data to inform
	 * @param {object=} options Options for Date components
	 * @returns {Promise<object>[]} Array of Responses
	 */
	send(accounts, processName, newStatus, content, options) {

		validateParams(this.session, accounts, processName, newStatus, content, options);

		const accountIds = this.formatAccounts(accounts);
		const msCall = this.session.getSessionInstance(MsCall);

		return Promise.all(
			accountIds.map(async accountId => {

				const {
					statusCode,
					body
				} = await msCall.safeCall(
					this.serviceName,
					this.serviceNamespace,
					this.serviceMethod,
					this.formatRequestData(processName, newStatus, content, options),
					null,
					{ id: accountId }
				);

				return {
					statusCode,
					body
				};
			})
		);
	}

	/**
	 * Format Accounts
	 * @param {string[]|string} accounts
	 * @returns {string[]}
	 */
	formatAccounts(accounts) {
		return isString(accounts) ? [accounts] : accounts;
	}

	/**
	 * Format Request Data to send
	 * @param {string} processName
	 * @param {string} newStatus
	 * @param {object} content
	 * @param {object} options
	 * @returns {object}
	 */
	formatRequestData(processName, newStatus, content, options) {
		return {
			process: processName,
			status: newStatus,
			...content && { content },
			...options.startDate && { startDate: new Date() },
			...options.endDate && { endDate: new Date() }
		};
	}
};
