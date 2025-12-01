import {sanitizeUser} from "../models/users.js";

export function attachUsersToPosts({posts, users}) {
  return posts.map(post => {
    const user = users.find(u => u.id === post.userId);
    const safeUser = sanitizeUser(user);
    return { ...post, user: safeUser };
  });


}

export async function isPostExists({title, userId, readPosts}) {
  const posts = await readPosts();

  return posts.some(
    post =>
      post.title.toLowerCase() === title.toLowerCase() &&
      post.userId === userId
  );
}
