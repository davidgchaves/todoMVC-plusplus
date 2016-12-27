'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.addColumn(
      'Todos',          // Name of an existing Table
      'completed',      // Name of the Attribute to add
      Sequelize.BOOLEAN // DataType of the Attribute
    ),

  down: (queryInterface, Sequelize) =>
    queryInterface.removeColumn(
      'Todos',     // Name of an existing Table
      'completed'  // Name of the Attribute to remove
    )
}
