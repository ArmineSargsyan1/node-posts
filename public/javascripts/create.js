const form = document.querySelector("#create_post");
const generalErrorEl = document.getElementById("general-error");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  if (data.tags) {
    data.tags = data.tags.split(",").map(t => t.trim());
  }

  try {
    const res = await axios.post("/posts/create", data);
    alert(res.data.message);
  } catch (err) {
    const errors = err.response?.data?.errors;
    const generalError = err.response?.data?.message;

    if (errors) showErrors(errors);
    if (generalError) showGeneralError(generalError);
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

function showGeneralError(message) {
    if (generalErrorEl && message !== "Validation error") {
      generalErrorEl.innerText = message;
      generalErrorEl.style.display = "block";
    }

}

function clearErrors() {
  document.querySelectorAll(".error").forEach(el => el.innerText = "");
  document.querySelectorAll(".input-error").forEach(el => el.classList.remove("input-error"));
  if (generalErrorEl) {
    generalErrorEl.innerText = "";
    generalErrorEl.style.display = "none";
  }
}
