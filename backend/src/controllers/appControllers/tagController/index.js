const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Company');

const create = require('./create');
const read = require('./read');
const paginatedList = require('./paginatedList');
const update = require('./update');
const remove = require('./remove');

methods.create = create;
methods.read = read;
methods.list = paginatedList;
methods.update = update;
methods.delete = remove;

module.exports = methods;
