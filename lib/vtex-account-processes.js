'use strict';

const MsCall = require('@janiscommerce/microservice-call');

const AccountProcessesValidator = require('./helpers/account-processes-validator');
const processStatuses = require('./helpers/process-statuses.json');

module.exports = class VtexAccountProcesses {

	static get statuses() {
		return processStatuses;
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
	 * @param {string} accountId Account ID
	 * @param {string} processName Process Name
	 * @param {string} newStatus Status
	 * @param {object=} content Extra Data to inform
	 * @param {object=} options Options for Date components
	 * @returns {Promise<object>[]} Array of Responses
	 */
	async send(accountId, processName, newStatus, content, options) {

		AccountProcessesValidator.validateParams(this.session, accountId, processName, newStatus, content, options);

		const msCall = this.session.getSessionInstance(MsCall);

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
			...options && options.startDate && { startDate: new Date() },
			...options && options.endDate && { endDate: new Date() }
		};
	}
};
