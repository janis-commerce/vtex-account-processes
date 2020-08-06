'use strict';

const VtexAccountProcesses = require('../vtex-account-processes');
const VtexAccountProcessesError = require('../vtex-account-processes-error');

const isString = value => typeof value === 'string';
const isObject = value => typeof value === 'object' && !Array.isArray(value);

const isValidAccountsIds = accounts => isString(accounts) || (Array.isArray(accounts) && accounts.length && accounts.every(isString));

/**
 * Validate Params formake a successufully request to VTEX-Commerce Account Process API
 * @param {*} session
 * @param {*} accounts
 * @param {*} processName
 * @param {*} newStatus
 * @param {*} content Optional
 * @param {*} options Optional
 */
const validateParams = (session, accounts, processName, newStatus, content, options) => {

	if(!session)
		throw new VtexAccountProcessesError('No Session found', VtexAccountProcessesError.codes.NO_SESSION);

	if(!isValidAccountsIds(accounts))
		throw new VtexAccountProcessesError('Invalid Accounts Ids', VtexAccountProcessesError.codes.INVALID_ACCOUNTS_ID);

	if(!isString(processName))
		throw new VtexAccountProcessesError('Invalid Process Name', VtexAccountProcessesError.codes.INVALID_PROCESS_NAME);

	if(!Object.entries(VtexAccountProcesses.statuses).includes(newStatus))
		throw new VtexAccountProcessesError('Invalid Status', VtexAccountProcessesError.codes.INVALID_STATUS);

	if(content && !isObject(content))
		throw new VtexAccountProcessesError('Invalid Content', VtexAccountProcessesError.codes.INVALID_CONTENT);

	if(options && !isObject(options))
		throw new VtexAccountProcessesError('Invalid Options', VtexAccountProcessesError.codes.INVALID_OPTIONS);
};

module.exports = {
	validateParams,
	isString
};
