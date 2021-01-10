import {
  IgApiClient,
  MediaRepositoryLikersResponseUsersItem,
} from "instagram-private-api";
import { config } from "dotenv";
import axios from "axios";
import { request } from "express";

export default class BotService {
  ig: IgApiClient;
  user: string;
  password: string;

  usersToFollow: MediaRepositoryLikersResponseUsersItem[];
  count: string[] = [];

  constructor() {
    this.ig = new IgApiClient();
  }

  async run(body, res) {
    const getWaitTime = () => Math.random() * 10 * 10000;
  
    const interval = setInterval(async () => {
      if (!this.usersToFollow || this.usersToFollow.length < 1) {
        await this.getLatestPostLikers(body)
          
          .catch((err) => {
            if (err) {
              res.status(200).json({ msg: "the user to parse is incorrect" });
              clearInterval(interval);
            }
          });
      } else {
        let user = this.usersToFollow.pop();
        while (user.is_private) {
          user = this.usersToFollow.pop();
        }

        await this.follow(user.pk);
        this.count.push(user.username);
        getWaitTime();
      }
      if (this.count.length > 50) {
        res.json({
          log: {
            login: "successfully logged you in",
            followed: `you have followed ${this.count.length} users`,
            limit: `you have reached the limit, bot stopped`,
          },
        });
        clearInterval(interval);
        this.count = [];
      }
    }, 15000);
  }

  async follow(userId: number) {
    await this.ig.friendship.create(userId);
  }

  async getLatestPostLikers(body) {
    const id = await this.ig.user.getIdByUsername(body.accountToParse);
    const feed = await this.ig.feed.user(id);
    const posts = await feed.items();
    this.usersToFollow = await (
      await this.ig.media.likers(posts[body.postId].id)
    ).users;
  }

  login(body, res) {
   

    this.ig.state.generateDevice(body.user);
    this.ig.simulate
      .preLoginFlow()
      .then((data) => {
        const loggedInAccount = this.ig.account
          .login(body.user, body.password)
          .then((data2) => {
            this.ig.simulate
              .postLoginFlow()
              .then((data3) => {
                this.run(body, res);
              })
              
          })
          .catch((err) => {
            if (err) {
              res
                .status(200)
                .json({ msg: "username or password is incorrect" });
            }
          });
      })
      
  }

//   async followers(body, res) {
//     this.ig.state.generateDevice(body.user);
//     this.ig.simulate.preLoginFlow().then(() => {
//       this.ig.account
//         .login(body.user, body.password)
//         .then((data) => {
//           this.ig.simulate.postLoginFlow().then(() => {
          

//             this.ig.feed.accountFollowers(data.pk).items$.subscribe(
//               (followers) => {
              
//                 //   followers.map((follower) => {
                   
//                 //   }),
//                   res.json(followers);
//               },
//               (error) =>{},
//                 () => {
                  
//               }
//             );
//             //   this.ig.feed.accountFollowers(data.pk).items().then((data) => {
           
//             // })
//           });
//         })
//         .catch((err) => {
        
//         });
//     });
//   }
}
