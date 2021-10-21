// Server URL
const URL = "//localhost:5000/api/accounts/";

// Account
let account = null;

const routes = {
  "/login": { templateId: "login" },
  "/dashboard": { templateId: "dashboard", init: updateDashboard },
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
function updateElement(id, textOrNode) {
  const element = document.getElementById(id);
  element.textContent = ""; // Removes all children
  element.append(textOrNode);
}

// ------------------------------------------
// Register
// ------------------------------------------
function register() {
  const registerForm = document.getElementById("registerForm");
  const formData = new FormData(registerForm);
  const data = Object.fromEntries(formData);
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
// Update Dashboard
// ------------------------------------------
function updateDashboard() {
  if (!account) {
    return navigate("/login");
  }

  updateElement("description", account.description);
  updateElement("balance", account.balance.toFixed(2));
  updateElement("currency", account.currency);

  const transactionsRow = document.createDocumentFragment();
  for (const transaction of account.transactions) {
    const transactionRow = createTransactionRow(transaction);
    transactionsRow.appendChild(transactionRow);
  }
  updateElement("transactions", transactionsRow);
}

// ------------------------------------------
// Create Transaction Row
// ------------------------------------------
function createTransactionRow(transaction) {
  const template = document.getElementById("transaction");
  const transactionRow = template.content.cloneNode(true);
  const tr = transactionRow.querySelector("tr");
  tr.children[0].textContent = transaction.date;
  tr.children[1].textContent = transaction.object;
  tr.children[2].textContent = transaction.amount.toFixed(2);
  return transactionRow;
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

  if (typeof route.init === "function") {
    route.init();
  }
}

window.onpopstate = () => updateRoute();
updateRoute();
