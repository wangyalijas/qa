const fs = require('fs');
const router = require('koa-router')();

function addMapping(mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            var path = url.substring(4);
            router.get(path, ...mapping[url]);
        } else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            router.post(path, ...mapping[url]);
        } else if (url.startsWith('PUT ')) {
            var path = url.substring(4);
            router.put(path, ...mapping[url]);
        } else if (url.startsWith('DELETE ')) {
            var path = url.substring(7);
            router.del(path, ...mapping[url]);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addControllers(dir) {
    fs.readdirSync(__dirname + '/' + dir).filter((f) => {
        return f.endsWith('.js');
    }).forEach((f) => {
        console.log(`process controller: ${f}...`);
        let mapping = require(__dirname + '/' + dir + '/' + f);
        addMapping(mapping);
    });
}

module.exports = {
    addController(dir) {
        let controllers_dir = dir || 'controllers';
        addControllers(controllers_dir);
        return router.routes();
    }
}