const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '7518930612:AAHpsqdM-ASOCO1ld_Hl6-Nn6oaXHWmU1DE';
const webAppUrl ='https://312a-195-158-4-67.ngrok-free.app';

const bot = new TelegramBot(token, {polling: true});
const app = express();


app.use(express.json());
app.use(cors());

bot.onText(/\/echo (.+)/, (msg, match) => {

  const chatId = msg.chat.id;
  const resp = match[1]; 

  bot.sendMessage(chatId, resp);
});


bot.on('message',  async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;



if (text=== '/start'){
 await bot.sendMessage(chatId, 'pasda tugmacha chiqadi uni bosing va formani toldiring',{
    reply_markup: {
       keyboard: [
        [ {text : 'buyurtma berish', web_app: { url: webAppUrl+'/form'}} ]
      ]
    }
});
  }
 

if(msg.web_app_data?.data){
  try{

    const data = JSON.parse(msg.web_app_data?.data)
await bot.sendMessage( chatId,"malumotingiz bilan bo'lishganingiz uchun tashakkur")
await bot.sendMessage( chatId,"Sizning Mamlakatingiz: "+ data.country)
await bot.sendMessage( chatId,"Sizning Shahringiz: "+ data.street)

setTimeout (async()=>{
  await bot.sendMessage( chatId,"Xamma informatsiyani ushbu chatda olishingiz munkin")

},3000)

  }catch{
    console.log(e)
  }
}
  }
)
 
app.post('/web-data', async (req, res) => {
     const {query_id, products,totalPrice} = req.body;
try{
  await bot.answerWebAppQuery(query_id, {
    type: 'article',
    id: query_id,
    title: 'Sizning buyurtmangiz qabul qilindi',
    input_message_content: {
      message_text: `Sizning buyurtmangiz qabul qilindi. Buyurtma summasi ${totalPrice} so'm.`
    }
  });
  return res.status(200).json({ message: 'Buyurtma qabul qilindi' });
}catch(e){
  await bot.answerWebAppQuery(query_id, {
    type: 'article',
    id: query_id,
    title: 'Buyurtmangiz qabul qilinishda xatolik yuz berdi',
    input_message_content: {
      message_text: `Buyurtmangiz qabul qilinishda xatolik yuz berdi.`
    }
  });
  return res.status(400).json({ message: 'Xatolik yuz berdi' });
}
     await bot.answerWebAppQuery(query_id, {
      type: 'article',
      id: query_id,
      title: 'Sizning buyurtmangiz qabul qilindi',
      input_message_content: {
        message_text: `Sizning buyurtmangiz qabul qilindi. Buyurtma summasi ${totalPrice} so'm.`
      }
    });
})
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));