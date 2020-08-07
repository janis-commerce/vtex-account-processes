'use strict';

const VtexAccountProcessesError = require('../vtex-account-processes-error');
const processStatuses = require('./process-statuses');

module.exports = class AccountProcessesValidator {

	/**
	 * Validate Params formake a successufully request to VTEX-Commerce Account Process API
	 * @param {*} session
	 * @param {*} accountId
	 * @param {*} processName
	 * @param {*} newStatus
	 * @param {*} content
	 * @param {*} options
	 */
	static validateParams(session, accountId, processName, newStatus, content, options) {

		if(!session)
			throw new VtexAccountProcessesError('No Session found', VtexAccountProcessesError.codes.NO_SESSION);

		if(!this.isObjectId(accountId))
			throw new VtexAccountProcessesError('Invalid Account Id', VtexAccountProcessesError.codes.INVALID_ACCOUNTS_ID);

		if(!this.isString(processName))
			throw new VtexAccountProcessesError('Invalid Process Name', VtexAccountProcessesError.codes.INVALID_PROCESS_NAME);

		if(!Object.values(processStatuses).includes(newStatus))
			throw new VtexAccountProcessesError('Invalid Status', VtexAccountProcessesError.codes.INVALID_STATUS);

		if(content && !this.isObject(content))
			throw new VtexAccountProcessesError('Invalid Content', VtexAccountProcessesError.codes.INVALID_CONTENT);

		if(options && !this.isObject(options))
			throw new VtexAccountProcessesError('Invalid Options', VtexAccountProcessesError.codes.INVALID_OPTIONS);
	}

	/**
	 * Validate if Value is String
	 * @param {*} value
	 */
	static isString(value) {
		return typeof value === 'string';
	}

	/**
	 * Validate if Value is ObjectId
	 * @param {*} value
	 */
	static isObjectId(value) {
		return typeof value === 'string' && /^[0-9a-fA-F]{24}$/.test(value);
	}

	/**
	 * Validate if Value is Object
	 * @param {*} value
	 */
	static isObject(value) {
		return typeof value === 'object' && !Array.isArray(value);
	}
};
