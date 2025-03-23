const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const methods = createCRUDController('Shipment');

const create = require('./create');
const update = require('./update');
const remove = require('./remove');
const paginatedList = require('./paginatedList');
const read = require('./read');

methods.create = create;
methods.update = update;
methods.delete = remove;
methods.list = paginatedList;
methods.delete = remove;
methods.read = read;

module.exports = methods;
