const _ = require('lodash');

_.assign(module.exports,
    require('./no-stdin'),
    require('./optional-stdin'),
    require('./required-stdin')
    )