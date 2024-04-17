import { Bot } from "@skyware/bot";
const PORT: number = +(process.env.PORT || 8081);
const NODE_ENV = process.env.NODE_ENV ?? "development";
const server = Bun.serve({
    port: PORT,
    fetch: async(req) => {
        if( ! process.env.BSKY_USERNAME ){
            return new Response(JSON.stringify({
                error: true,
                errorObj: 'No BSKY_USERNAME',
            }),{
                status: 400,
            });
        }
        if( ! process.env.BSKY_PASSWORD ){
            return new Response(JSON.stringify({
                error: true,
                errorObj: 'No BSKY_PASSWORD',
            }),{
                status: 400,
            });
        }
        const bot = new Bot();
        await bot.login({
                identifier: process.env.BSKY_USERNAME as string,
                password: process.env.BSKY_PASSWORD as string,
            });
        try {
            const posts = await bot.getUserLikes('did:plc:payluere6eb3f6j5nbmo2cwy');

            let data = posts.posts.map((post) => {
                const author = post.author;
                return Object.assign({},{
                    text: post.text,
                    author: {
                        did: author.did,
                        handle: author.handle,
                        displayName: author.displayName,
                    },
                    uri: post.uri

                });
            });
            //@ts-ignore
            return new Response(JSON.stringify(data));

        } catch (error) {
            console.log(error);
            return new Response(JSON.stringify({
                error: true,
                errorObj: error,
            }));
        }
    },
});
console.log(`[${NODE_ENV}] Serving http://localhost:${server.port}`);
