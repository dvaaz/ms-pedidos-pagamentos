import fastify from "fastify";
import type {FastifyInstance} from "fastify";

const app: FastifyInstance = fastify({
    // debugger do servidor, manter true antes da entrega
    logger:true
})

app.listen({ port: 3000}, (erro, address) => {
    if (erro) {
        app.log.error(erro);
    } else {
        app.log.info(`Server listening at ${address}`);
        console.log(`Outra forma de envio de mensagem no log...`);
    }
});