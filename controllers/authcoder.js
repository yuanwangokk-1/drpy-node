import * as misc from '../utils/misc.js';

export default (fastify, options, done) => {
    // 注册 /authcoder 路由
    fastify.get('/authcoder', async (request, reply) => {
        const {len, number} = request.query;

        // 参数校验
        if (!len || !number || isNaN(len) || isNaN(number)) {
            return reply.status(400).send('Missing or invalid required parameters: len and number');
        }

        const length = parseInt(len, 10);
        const count = parseInt(number, 10);

        if (length <= 0 || count <= 0) {
            return reply.status(400).send('Parameters len and number must be positive integers.');
        }

        try {
            // 生成随机字符串集合
            const result = Array.from({length: count}, () => misc.randStr(length)).join('\n');

            // 返回 text/plain 响应
            reply.type('text/plain').send(result);
        } catch (error) {
            // 异常处理
            fastify.log.error(error);
            reply.status(500).send('An error occurred while generating strings.');
        }
    });

    done();
};
