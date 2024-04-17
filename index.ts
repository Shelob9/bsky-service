import { Bot, Post } from "@skyware/bot";
const PORT: number = +(process.env.PORT || 8081);
const NODE_ENV = process.env.NODE_ENV ?? "development";

const postFactory = (post: Post) => {
    return {
        text: post.text,
        cid: post.cid,
        labels: post.labels,
        author: {
            did: post.author.did,
            handle: post.author.handle,
            displayName: post.author.displayName,
        },
        uri: post.uri,
        createdAt: post.createdAt,
        replyCount: post.replyCount,
        likeCount: post.likeCount,
    }

}
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
            const uri = posts.posts[0].uri
            const post = await bot.getPost(uri);
            let data = {
                uri,
                post: postFactory(post),
                likes: posts.posts.map(postFactory),

            }
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
