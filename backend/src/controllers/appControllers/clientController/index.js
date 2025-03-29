const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Client');

const summary = require('./summary');
const create = require('./create');
const update = require('./update');
const remove = require('./remove');
const list = require('./paginatedList');
const read = require('./read');

methods.summary = summary;
methods.create = create;
methods.update = update;
methods.delete = remove;
methods.list = list;
methods.read = read;

module.exports = methods;
