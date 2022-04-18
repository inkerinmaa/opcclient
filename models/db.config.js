const dbConfig = {
    host: '167.71.69.121',
    user: 'inkerinmaa',
    password: '',
    database: 'EVENTS',
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}

const token = 'jEG_pvqQ9g7IvPfrkYkUqtFLtopB40TK2X7SWx4wNjn1Xzt05XC8BqxzdiNsruV275Tu_4qU9HBbvNh81NJIMQ=='

module.exports = {
    dbConfig: dbConfig,
    token: token
}
