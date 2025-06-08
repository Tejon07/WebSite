require('dotenv').config();

module.exports = {
    app: {
        port: process.env.PORT || 4000,
    },
    mssql: {
        server: process.env.MSSQL_SERVER || 'localhost',
        database: process.env.MSSQL_DATABASE || 'Tienda_db',
        driver: process.env.MSSQL_DRIVER || 'msnodesqlv8',
        options: {
            trustedConnection: process.env.MSSQL_TRUSTED_CONNECTION === 'true'
        }
    }
};
