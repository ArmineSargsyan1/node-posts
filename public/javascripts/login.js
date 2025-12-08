const form = document.querySelector("#login_form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // --- Clear previous errors ---
  const inputs = form.querySelectorAll("input");
  inputs.forEach(input => {
    input.style.border = "";
    // Get the error span without using closest()
    const span = input.parentElement.querySelector(".error-message");
    if (span) span.textContent = "";
  });

  // --- Build form data ---
  const formData = new FormData(form);
  const raw = Object.fromEntries(formData.entries());

  try {
    const { data } = await axios.post("/users/login", raw);
    console.log("Login success:", data);
    alert("Login successful!");
    // Optionally redirect after login
    // window.location.href = "/dashboard";
  } catch (err) {
    console.log("Error response:", err.response?.data);

    const errors = err?.response?.data?.errors;
    const message = err?.response?.data?.message;

    // --- Show general error ---
    const generalErrorDiv = document.querySelector(".general-error");
    if (message && generalErrorDiv) {
      generalErrorDiv.textContent = message;
    }

    // --- Show field-specific errors ---
    if (errors) {
      inputs.forEach(input => {
        const errorMsg = errors[input.name] || null;
        const span = input.parentElement.querySelector(".error-message");

        if (errorMsg && span) {
          input.style.border = "1px solid red";
          span.textContent = errorMsg;
        }
      });
    }
  }
});
