import express from "express";
import BotService from './services/services';
import cors from 'cors'
const app = express();
const port = 8080 || process.env.PORT;
const bot = new BotService();

app.listen(port, async () => {

    app.use(express.json());
    app.use(cors());
    app.post('/login', async (req, res) => {
       
        await bot.login(req.body, res)
 
      
    })
  app.post('/followers', async (req, res) => {
    bot.followers(req.body, res)
  })
 
 
  
  // tslint:disable-next-line:no-console
  
});