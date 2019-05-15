exports.config = {
    mysql      : {
        host            : "104.196.47.93",
        user            : "admin",
        password        : "mysql",
        database        : "vox_cinema",
        connectionLimit : 50
    },
    errorCodes : {
        connectionError    : 101,
        connectionNotFound : 102,
        queryError         : 103,
        paramsMissing: 104
    }
};
