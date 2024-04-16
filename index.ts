import { Bot } from "@skyware/bot";
Bun.serve({
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
            console.log(Object.keys(posts));
            let data = posts.posts.map((post) => {
                return {
                    text: post.text,
                    author: post.author,
                    uri: post.uri,

                };
            });
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
