function setNestedValue(obj, pathArray, value) {
  const key = pathArray[0];

  if (pathArray.length === 1) {
    obj[key] = value;
    return;
  }

  if (!obj[key]) obj[key] = {};

  setNestedValue(obj[key], pathArray.slice(1), value);
}

const form = document.querySelector("#registration_form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // --- Clear previous errors ---
  const inputs = form.querySelectorAll("input");
  inputs.forEach(input => {
    input.style.border = "";
    const span = input.closest(".form-group").querySelector(".error-message");
    if (span) span.textContent = "";
  });

  // --- Build nested form data ---
  const formData = new FormData(form);
  const raw = Object.fromEntries(formData.entries());
  const res = {};

  for (const key in raw) {
    const value = raw[key];
    const pathArray = key.replace(/\]/g, "").split("[");
    setNestedValue(res, pathArray, value);
  }

  try {
    const { data } = await axios.post("/users/registration", res);
    console.log("Success:", data);
  } catch (err) {
    console.log("Error response:", err.response?.data);

    const errors = err?.response?.data?.errors;
    const message = err?.response?.data?.message;



    if (errors) {
      const getNestedError = (errorsObj, name) => {
        const path = name.replace(/\]/g, "").replace(/\[/g, ".");
        const parts = path.split(".");

        if (parts.length === 1) {
          return errorsObj[parts[0]] || null;
        }


        let current = errorsObj;

        for (let i = 1; i < parts.length; i++) {
          const part = parts[i];

          if (current && typeof current === "object" && part in current) {
            current = current[part];
          } else {
            return null;
          }
        }

        return typeof current === "string" ? current : null;
      };

      inputs.forEach(input => {

        const errorMsg = getNestedError(errors, input.name);

        const span = input.closest(".form-group").querySelector(".error-message");

        if (errorMsg && span) {
          input.style.border = "1px solid red";
          span.textContent = errorMsg

        }
      });
    }
  }
});


