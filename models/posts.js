import path from "path";
import fs from "fs/promises";
import {v4 as uuid} from "uuid";


const dataDir = path.join(process.cwd(), "data");

const postsFile = path.join(dataDir, "posts.json");

export async function initializePostsFile() {
  try {
    await fs.mkdir(dataDir, {recursive: true});
    try {
      await fs.access(postsFile);
    } catch {
      await fs.writeFile(postsFile, "[]", "utf-8");
    }
  } catch (err) {
    console.log("Error initializing data file:", err);
  }
}

export async function readPosts() {
  try {
    const data = await fs.readFile(postsFile, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function writePosts(posts) {
  await fs.writeFile(postsFile, JSON.stringify(posts, null, 2), "utf-8");
}

export async function findPostById(id) {
  const posts = await readPosts();
  return posts.find(post => post.id === id) || null;
}


export function addComment({posts, post, users, userId, text}) {

  const user = users.find(u => u.id === userId);
  if (!user) {
    throw new Error("Author not found");
  }

  if (!post.comments) {
    post.comments = [];
  }

  const newComment = {
    id: uuid(),
    userId,
    text,
    createdAt: new Date().toISOString()
  };

  post.comments = [newComment, ...post.comments]
  return {newComment, posts};
}


export async function createPost({title, content, author, tags, userId,}) {

  const posts = await readPosts();

  const newPost = {
    id: uuid(),
    title,
    content,
    author,
    userId,
    tags: Array.isArray(tags) ? tags : [],
    createdAt: new Date().toISOString()
  };

  await writePosts([...posts, newPost]);

  return newPost;
}

export async function filterPosts(filters) {
  console.log(filters,33)
  const posts = await readPosts();
  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || 10;

  const filterKeys = Object.keys(filters).filter(
    key => !["page", "limit", "sort"].includes(key)
  );

  const normalize = str =>
    str?.toString()?.toLowerCase()?.replace(/\s+/g, "").trim();

  // -------------------------
  //FILTER POSTS
  // -------------------------
  let filteredPosts = posts.filter(post => {
    return filterKeys.every(key => {
      const filterValue = normalize(filters[key]);

      // SEARCH title + content
      if (key === "search") {
        return (
          normalize(post.title)?.includes(filterValue) ||
          normalize(post.content)?.includes(filterValue)
        );
      }

      // -------------------------
      // CATEGORIES
      // -------------------------
      if (key === "categories") {
        const values = Array.isArray(post.categories)
          ? post.categories
          : Array.isArray(post.tags)
            ? post.tags
            : [];

        return values.some(item => normalize(item).includes(filterValue));
      }


      if (!(key in post)) return false;
      const postValue = post[key];

      if (!postValue) return false;

      return normalize(postValue).includes(filterValue);
    });
  });

  // -------------------------
  // SORT POSTS
  // -------------------------
  if (filters.sort) {

    const sortRules = filters.sort.split(",").map(rule => {
      const [field, order] = rule.split(":");
      return {field, order: order === "asc" ? "asc" : "desc"};
    });

    filteredPosts.sort((a, b) => {
      for (const {field, order} of sortRules) {
        let aVal = a[field];
        let bVal = b[field];

        // Date fields
        if (field === "createdAt") {
          aVal = new Date(aVal);
          bVal = new Date(bVal);

          const diff = aVal - bVal;
          if (diff !== 0) return order === "asc" ? diff : -diff;
        }

        // String fields
        else if (typeof aVal === "string" && typeof bVal === "string") {
          const diff = aVal.localeCompare(bVal);
          if (diff !== 0) return order === "asc" ? diff : -diff;
        }

        // Number fields
        else if (typeof aVal === "number" && typeof bVal === "number") {
          const diff = aVal - bVal;
          if (diff !== 0) return order === "asc" ? diff : -diff;
        }
      }

      return 0;
    });

  } else {
    filteredPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }


  // -------------------------
  //PAGINATION
  // -------------------------
  const startIndex = (page - 1) * limit;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + limit);

  return {paginatedPosts, filteredPosts};
}


export async function updatePost({id, title, content, tags}) {
  const posts = await readPosts();
  const matchedPost = findPostById(id);
  if (!matchedPost) throw new Error("Post not found");

  const newData = {
    title: title ?? matchedPost.title,
    content: content ?? matchedPost.content,
    author: matchedPost.author,
    tags: tags ?? matchedPost.tags
  };

  const updatedPosts = posts.map(p =>
    p.id === id ? {...p, ...newData, updatedAt: new Date().toISOString()} : p
  );

  await writePosts(updatedPosts);

  return findPostById(id);
}


export async function deletePost(id) {
  const posts = await readPosts();

  const existingPost = findPostById(id)

  if (!existingPost) {
    throw new Error("Post not found");
  }

  await writePosts(posts.filter(p => p.id !== id));

  return existingPost;
}

