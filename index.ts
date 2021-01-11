import express from "express";
import BotService from './src/services/services';
const app = express();
const port =process.env.PORT || 8080;
const bot = new BotService();
import cors from "cors"
app.use(cors())


    app.use(express.json());
    
    app.post('/login', async (req, res) => {
       
        await bot.login(req.body, res)
 
      
    })
  
  app.get('/', ((req, res) => {
    res.send('<h1>this API is owned by K, Contact on whatsapp, +2348114426271<h1>')
  }))
  // app.post('/followers', async (req, res) => {
  //   bot.followers(req.body, res)
  // })
 
 
  app.listen(port, async () => {
  // tslint:disable-next-line:no-console
  console.log(`server started on port ${port}`)
});