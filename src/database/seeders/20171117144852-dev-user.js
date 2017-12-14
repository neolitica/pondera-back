const encrypt = require('../../helpers/session');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('Users', [{
    name: 'Don Felipe',
    mail: 'admin@educalabs.cl',
    rut: '19291235-0',
    phone: '+569569569',
    password_digest: encrypt.encryptPasswd('123123'),
    admin: true,
    superadmin: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  }], {}),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {}),
};
