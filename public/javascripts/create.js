// const form = document.getElementById("createPostForm");
//
// console.log(form,11)
// form.addEventListener("submit", async (e) => {
//   e.preventDefault();
//   clearErrors();
//
//   const formData = new FormData(form);
//   const data = Object.fromEntries(formData.entries());
//
//   if (data.tags) {
//     data.tags = data.tags.split(",").map(t => t.trim());
//   }
//
//   try {
//     const res = await axios.post("/posts/create", data);
//     alert(res.data.message);
//   } catch (err) {
//     const errors = err.response?.data?.errors;
//
//     if (errors) {
//       showErrors(errors);
//     }
//   }
// });
//
// function showErrors(errors) {
//   console.log(errors,111)
//   Object.keys(errors).forEach((field) => {
//     const input = document.querySelector(`[name="${field}"]`);
//     const errorEl = document.getElementById(`error-${field}`);
//
//     if (input) input.classList.add("input-error");
//     if (errorEl) errorEl.innerText = errors[field];
//
//     console.log(errorEl,999)
//   });
// }
//
// function clearErrors() {
//   document.querySelectorAll(".error").forEach((el) => (el.innerText = ""));
//   document.querySelectorAll(".input-error").forEach((el) =>
//     el.classList.remove("input-error")
//   );
// }


const form = document.querySelector("#createPost_form");

console.log("form:", form);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  console.log(data,2222)
  if (data.tags) {
    data.tags = data.tags.split(",").map(t => t.trim());
  }

  try {
    const res = await axios.post("/posts/create", data);
    alert(res.data.message);
  } catch (err) {
    const errors = err.response?.data?.errors;
    if (errors) showErrors(errors);
  }
});

function showErrors(errors) {
  Object.keys(errors).forEach((field) => {
    const input = document.querySelector(`[name="${field}"]`);
    const errorEl = document.getElementById(`error-${field}`);

    if (input) input.classList.add("input-error");
    if (errorEl) errorEl.innerText = errors[field];

    console.log("errorEl:", errorEl, "input:", input, "message:", errors[field]);
  });
}

function clearErrors() {
  document.querySelectorAll(".error").forEach(el => el.innerText = "");
  document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
}
