
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Ponderations', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    value: {
      type: Sequelize.FLOAT,
    },
    university: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    career: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    universityId: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    // userId: {
    //   type: Sequelize.INTEGER,
    //   references: { model: 'Users', key: 'id' },
    // },
    // optId: {
    //   type: Sequelize.INTEGER,
    //   references: { model: 'Opts', key: 'id' }
    // },
    careerId: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    NEM: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    ranking: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    math: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    language: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    science: {
      type: Sequelize.INTEGER,
    },
    history: {
      type: Sequelize.INTEGER,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Ponderations'),
};
