// Server URL
const URL = "//localhost:5000/api/accounts/";

// Account
let account = null;

const routes = {
  "/login": { templateId: "login" },
  "/dashboard": { templateId: "dashboard" },
};

function navigate(path) {
  window.history.pushState({}, path, path);
  updateRoute();
}

/**
 * Prevent reload while navigating
 */
function onLinkClick(event) {
  event.preventDefault();
  navigate(event.target.href);
}

// ------------------------------------------
// Update Element
// ------------------------------------------
function updateElement(id, text) {
  const element = document.getElementById(id);
  element.style.display = "block";
  element.textContent = text;
}

// ------------------------------------------
// Register
// ------------------------------------------
function register() {
  const registerForm = document.getElementById("registerForm");
  const formData = new FormData(registerForm);
  console.log("Form Data:", formData);
  const data = Object.fromEntries(formData);
  console.log("Data:", data);
  const jsonData = JSON.stringify(data);
  const result = createAccount(jsonData);

  if (result.error) {
    return console.log("An error occured:", result.error);
  }

  console.log("Account created!", result);

  account = result;
  navigate("/dashboard");
}

async function createAccount(account) {
  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: account,
    });
    return await response.json();
  } catch (error) {
    return { error: error.message || "Unknown error" };
  }
}

// ------------------------------------------
// Login User
// ------------------------------------------
async function login() {
  const loginForm = document.getElementById("loginForm");
  const user = loginForm.user.value;
  const data = await getAccount(user);

  if (data.error) {
    return updateElement("loginError", data.error);
  }

  account = data;
  navigate("/dashboard");
}

// ------------------------------------------
// Get Specific User
// ------------------------------------------
async function getAccount(user) {
  try {
    const response = await fetch(URL + encodeURIComponent(user));

    return await response.json();
  } catch (error) {
    return { error: error.message || "Unknown error!" };
  }
}

// ------------------------------------------
// Route Handling
// ------------------------------------------
function updateRoute() {
  const path = window.location.pathname;
  const route = routes[path];

  if (!route) {
    return navigate("/login");
  }

  const template = document.getElementById(route.templateId);
  const view = template.content.cloneNode(true);
  const app = document.getElementById("app");
  app.innerHTML = "";
  app.appendChild(view);
}

window.onpopstate = () => updateRoute();
updateRoute();
