
import { Bot } from "@skyware/bot";
//@ts-ignore
import 'dotenv/config';
import { Router } from 'express';
let indexRouter = Router();


indexRouter.all('/', async (req,res) => {
    res.json({hi:'Hello World'});
});

indexRouter.all('/bot', async (req,res) => {
  const
  bot = new
    Bot();
    await
      bot.
        login({
          identifier: process.env.BLUESKY_USER as string,
          password: process.env.BLUESKY_PASSWORD as string,
        });

    try {
        const profile = await bot.getUserLikes('did:plc:payluere6eb3f6j5nbmo2cwy');
        return new Response(JSON.stringify({
          profile
        }));
    } catch (error) {
      return new Response(JSON.stringify({
        error: true,
        errorObj: error,
      }));
    }
});

export { indexRouter };
