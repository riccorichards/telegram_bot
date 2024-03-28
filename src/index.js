require("dotenv").config();

const {
  Bot,
  GrammyError,
  HttpError,
  Keyboard,
  InlineKeyboard,
} = require("grammy");

const bot = new Bot(process.env.TOKEN);
bot.api.setMyCommands([
  { command: "start", description: "Starts bot" },
  { command: "help", description: "helps command" },
]);

bot.command(["say_hello", "hello"], async (ctx) => {
  await ctx.reply("Hello.");
});

bot.command("start", async (ctx) => {
  await ctx.react("🙏");
  await ctx.reply(
    "Hi there, I'm Ricco_Bot. <a href='https://www.youtube.com/watch?v=q-AFR0D7Vuw'>Content</a>",
    {
      //reply_parameters: { message_id: ctx.msg.message_id },
      parse_mode: "HTML",
      //hide content
      disable_web_page_preview: true,
    }
  );
});

bot.command("mood", async (ctx) => {
  const moodKeyboard = new Keyboard()
    .text("Cool!")
    .row()
    .text("Norm!")
    .row()
    .text("bad!")

    .oneTime()
    .resized();

  await ctx.reply("How are you?", {
    reply_markup: moodKeyboard,
  });
});

bot.command("share", async (ctx) => {
  const shareKeyboard = new Keyboard()
    .requestContact("Contact")
    .requestLocation("Location")
    .requestPoll("Poll")
    .resized();

  await ctx.reply("What do you want to share?", {
    reply_markup: shareKeyboard,
  });
});

bot.command("inline_keyboard", async (ctx) => {
  const inlineKeyboard = new InlineKeyboard()
    .text("1", "one")
    .text("2", "two")
    .text("3", "three");

  await ctx.reply("Choose the Number", {
    reply_markup: inlineKeyboard,
  });
});

bot.callbackQuery(/[one, two, three]/, async (ctx) => {
  await ctx.answerCallbackQuery();
  await ctx.reply(`We have: ${ctx.callbackQuery.data}`);
});
//bot.on("callback_query:data", async (ctx) => {
//  await ctx.answerCallbackQuery();
//  await ctx.reply(`We have: ${ctx.callbackQuery.data}`);
//});

bot.on(":contact", async (ctx) => {
  await ctx.reply("Thank fot your sharing.");
});
//bot.hears("Cool", async (ctx) => {
//  await ctx.reply("Great!", {
//    reply_markup: { remove_keyboard: true },
//  });
//});
//message reply with filter

bot.on([":media", "::url"], async (ctx) => {
  await ctx.reply("I received URL");
});

bot.hears("ID", async (ctx) => {
  await ctx.reply(`Your ID: ${ctx.from.id}`);
});

bot.on("msg").filter(
  (ctx) => {
    //console.log(ctx.from.id);
    return ctx.from.id === 5229302686;
  },
  async (ctx) => {
    await ctx.reply("I know you");
  }
);

//handle the entire content based on provided keyword /keyword/
bot.hears(/fuck/, async (ctx) => {
  await ctx.reply("We do not use bad words here!");
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
