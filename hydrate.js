require("dotenv").config();

const {
  Bot,
  GrammyError,
  HttpError,
  Keyboard,
  InlineKeyboard,
} = require("grammy");
const { hydrate } = require("@grammyjs/hydrate");
const bot = new Bot(process.env.TOKEN);
bot.use(hydrate());
bot.api.setMyCommands([
  { command: "start", description: "Starts bot" },
  { command: "menu", description: "Run bot..." },
]);

bot.command("start", async (ctx) => {
  await ctx.react("🙏");
  await ctx.reply(
    "Hi there, I'm Ricco_Bot. <a href='https://www.youtube.com/watch?v=q-AFR0D7Vuw'>Content</a>",
    {
      //reply_parameters: { message_id: ctx.msg.message_id },
      parse_mode: "HTML",
      //hide content
    }
  );
});

const menuKeyboard = new InlineKeyboard()
  .text("Status Oders", "status_order")
  .text("Support", "support");
const backKeyboard = new InlineKeyboard().text("<= Back to the menu", "back");

bot.command("menu", async (ctx) => {
  await ctx.reply("chooce the way", {
    reply_markup: menuKeyboard,
  });
});

bot.callbackQuery("status_order", async (ctx) => {
  await ctx.callbackQuery.message.editText("Done", {
    reply_markup: backKeyboard,
  });
  await ctx.answerCallbackQuery();
});

bot.callbackQuery("support", async (ctx) => {
  await ctx.callbackQuery.message.editText("Tell us what happened", {
    reply_markup: backKeyboard,
  });
  await ctx.answerCallbackQuery();
});
bot.callbackQuery("back", async (ctx) => {
  await ctx.callbackQuery.message.editText("chooce the way", {
    reply_markup: menuKeyboard,
  });
  await ctx.answerCallbackQuery();
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.log("Error in request: " + e.description);
  } else if (e instanceof HttpError) {
    console.log("Could not contact telegram: " + e);
  } else {
    console.log("Unknown error: " + e);
  }
});

bot.start();
