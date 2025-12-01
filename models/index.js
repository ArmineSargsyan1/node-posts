import { initializeDataFile as usersInit } from "./users.js";
import {initializePostsFile} from "./posts.js";


(async () => {
  await usersInit();
  await initializePostsFile()
})();
