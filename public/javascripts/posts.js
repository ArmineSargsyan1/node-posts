document.addEventListener("DOMContentLoaded", async () => {
  const postList = document.getElementById("post-list");

  try {
    const response = await axios.get("/posts");

    const posts = response.data.posts;

    if (!posts || !posts.length) {
      postList.innerHTML = "<li>No posts available.</li>";
    } else {
      posts.forEach(post => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${post.title}</strong>: ${post.content}`;
        postList.appendChild(li);
      });
    }
  } catch (err) {
    console.error(err);
    postList.innerHTML = "<li>Failed to load posts.</li>";
  }
});
