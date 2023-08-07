const fl = require("./fl.js")
const fio = require("./fio.js")
const born = require("./born.js")
const docs = require("./docs.js")
const address = require("./address.js")

//Методы работы с персоналом

//таблица FL
module.exports.getPersonnel = fl.get;
module.exports.getPersonnelByParam =  fl.getByParam;
module.exports.getOnePersonnel = fl.getOne;
module.exports.createPersonnel = fl.create;
module.exports.updatePersonnel = fl.update;
module.exports.deletePersonnel = fl.delete;

//таблица fl_ch_fio
module.exports.getFio = fio.get;
module.exports.getFioByParam = fio.getByParam;
module.exports.getOneFio = fio.getOne;
module.exports.createFio = fio.create;
module.exports.updateFio = fio.update;
module.exports.deleteFio = fio.delete;

//таблица fl_born
module.exports.getBorn =  born.get;
module.exports.getBornByParam = born.getByParam;
module.exports.getOneBorn = born.getOne;
module.exports.createBorn = born.create;
module.exports.updateBorn = born.update;
module.exports.deleteBorn = born.delete;

//таблица fl_docs
module.exports.getDocs = docs.get;
module.exports.getDocsByParam = docs.getByParam;
module.exports.getOneDocs = docs.getOne;
module.exports.createDocs = docs.create;
module.exports.updateDocs = docs.update;
module.exports.deleteDocs = docs.delete;

//таблица fl_address
module.exports.getAddress = address.get;
module.exports.getAddressByParam = address.getByParam;
module.exports.getOneAddress = address.getOne;
module.exports.createAddress = address.create;
module.exports.updateAddress = address.update;
module.exports.deleteAddress = address.delete;