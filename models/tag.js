const dbConfig = require('./db.config.js')

const Sequelize = require('sequelize') 

const DataTypes = Sequelize.DataTypes

const sequelize = new Sequelize(dbConfig.database, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const Tag = sequelize.define('Tags', {
  name: {
    type: DataTypes.STRING,
    unique: true
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  value: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  qualityText: {
    type: DataTypes.STRING,
    allowNull: false,  
    defaultValue: 'Bad' 
  }
  // dataType: DataTypes.INTEGER,
  // dataTypeText: DataTypes.STRING,
  // arrayType: DataTypes.INTEGER,
  // arrayTypeText: DataTypes.STRING,
  // format: DataTypes.STRING
})


sequelize.sync()
  .then(() => {
    console.log(`Database & tables created!`);

    // Tag.bulkCreate([
    //   { name: 'Counter', address: 'ns=1;i=1001', value: 111.90, qualityText: 'Good' },
    //   { name: 'Static', address: 'ns=1;i=1001', value: 222.87, qualityText: 'Good' },
    //   { name: 'FreeMem', address: 'ns=1;i=1001', value: 333.77, qualityText: 'Good' }
    // ]).then(function() {
    //   return Tag.findAll();
    // }).then(function(tags) {
    //   console.log(tags);
    // });

  });



function seq_auth() {
  sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.')
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err)
  })
}

// export function getAll (req, res) {
//   Tag.findAll().then(tags => {
//     res.json(tags)
//   })
// }

// const data = { id: 2, name: 'Static_Upd', address: 'ns=1;i=2', value: 222.90, qualityText: 'Bad' }

function updateTags (data) {
  Tag.findByPk(data.id).then(function(tag) {
    tag.update({
      name: data.name,
      address: data.address,
      value: data.value,
      qualityText: data.qualityText
    })
  })
}

module.exports = {
    seq_auth,
    updateTags
}