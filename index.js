const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const cors = require("cors");
const token = "6023728485:AAE8c1_U2bZiRzgJRB51-NeM-YK-JzmQ7dQ";
const webAppUrl = "https://048c-188-169-249-117.ngrok-free.app/";
const bot = new TelegramBot(token, { polling: true });
const app = express();
app.use(cors());
app.use(express.json());

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (text === "/start") {
    await bot.sendMessage(chatId, "Welcome to the bot", {
      reply_markup: {
        keyboard: [
          [
            {
              text: "Вот",
              web_app: {
                url: webAppUrl + `form`,
              },
            },
          ],
        ],
      },
    });
    await bot.sendMessage(chatId, "inline", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Вот",
              web_app: {
                url: webAppUrl,
              },
            },
          ],
        ],
      },
    });
  }
  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);
      await bot.sendMessage(chatId, `Спасибо за связь`);
      await bot.sendMessage(chatId, data?.country);
    } catch (e) {
      console.log(e);
    }
  }
});

app.post("/web-data", async (req, res) => {
  const { queryId, product, totalPrice } = req.body;
  try {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Заказ принят",
      input_message_content: {
        message_text: `Ваш заказ на сумму ${totalPrice} принят`,
      },
    });
    return res.status(200).json({});
  } catch (error) {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Заказ не принят",
      input_message_content: {
        message_text: `Не удалось принять заказ на сумму ${totalPrice}`,
      },
    });
    return res.status(500).json({});
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
