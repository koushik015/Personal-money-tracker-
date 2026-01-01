// Bill Tracker by [Your Name] - tracks pocket money, expenses, and debts
let allowance = 0;
let expenses = {};
let totalSpent = 0;
let oweMe = [];
let iOwe = [];

// Load saved data when the page loads
window.onload = function() {
  allowance = parseInt(localStorage.getItem("allowance")) || 0;
  expenses = JSON.parse(localStorage.getItem("expenses")) || {};
  oweMe = JSON.parse(localStorage.getItem("oweMe")) || [];
  iOwe = JSON.parse(localStorage.getItem("iOwe")) || [];
  totalSpent = Object.values(expenses).reduce((sum, val) => sum + val, 0);
  
  // Update UI with saved data
  document.getElementById("showAllowance").textContent = allowance;
  for (let cat in expenses) {
    const li = document.createElement("li");
    li.textContent = `${cat}: ₹${expenses[cat]}`;
    document.getElementById("expense-list").appendChild(li);
  }
  oweMe.forEach(amt => {
    const li = document.createElement("li");
    li.textContent = `Someone: +₹${amt}`;
    li.classList.add("oweMe");
    document.getElementById("oweMeList").appendChild(li);
  });
  iOwe.forEach(amt => {
    const li = document.createElement("li");
    li.textContent = `Someone: -₹${amt}`;
    li.classList.add("iOwe");
    document.getElementById("iOweList").appendChild(li);
  });
  updateSummary();
  updateChart();
};

// Set and save pocket allowance
function setAllowance() {
  allowance = parseInt(document.getElementById("allowance").value) || 0;
  if (allowance < 0) {
    alert("Please enter a valid allowance (0 or greater).");
    return;
  }
  document.getElementById("showAllowance").textContent = allowance;
  localStorage.setItem("allowance", allowance); // Save to localStorage
  updateSummary();
}

// Add an expense and save it
function addExpense() {
  const cat = document.getElementById("category").value;
  const amt = parseInt(document.getElementById("amount").value) || 0;
  if (amt <= 0) {
    alert("Please enter an amount greater than 0.");
    return;
  }

  if (!expenses[cat]) expenses[cat] = 0;
  expenses[cat] += amt;
  totalSpent += amt;

  const li = document.createElement("li");
  li.textContent = `${cat}: ₹${amt}`;
  document.getElementById("expense-list").appendChild(li);

  localStorage.setItem("expenses", JSON.stringify(expenses)); // Save expenses
  updateSummary();
  updateChart();
}

// Add an "Owe Me" entry and save it
function addOweMe() {
  const name = document.getElementById("oweMeName").value;
  const amt = parseInt(document.getElementById("oweMeAmount").value) || 0;
  if (!name || amt <= 0) {
    alert("Please enter a valid name and amount greater than 0.");
    return;
  }

  oweMe.push(amt);
  const li = document.createElement("li");
  li.textContent = `${name}: +₹${amt}`;
  li.classList.add("oweMe");
  document.getElementById("oweMeList").appendChild(li);

  document.getElementById("oweMeName").value = "";
  document.getElementById("oweMeAmount").value = "";
  localStorage.setItem("oweMe", JSON.stringify(oweMe)); // Save oweMe
  updateSummary();
}

// Add an "I Owe" entry and save it
function addIOwe() {
  const name = document.getElementById("iOweName").value;
  const amt = parseInt(document.getElementById("iOweAmount").value) || 0;
  if (!name || amt <= 0) {
    alert("Please enter a valid name and amount greater than 0.");
    return;
  }

  iOwe.push(amt);
  const li = document.createElement("li");
  li.textContent = `${name}: -₹${amt}`;
  li.classList.add("iOwe");
  document.getElementById("iOweList").appendChild(li);

  document.getElementById("iOweName").value = "";
  document.getElementById("iOweAmount").value = "";
  localStorage.setItem("iOwe", JSON.stringify(iOwe)); // Save iOwe
  updateSummary();
}

// Update the summary dashboard
function updateSummary() {
  const totalOweMe = oweMe.reduce((a, b) => a + b, 0);
  const totalIOwe = iOwe.reduce((a, b) => a + b, 0);

  document.getElementById("totalSpent").textContent = totalSpent;
  document.getElementById("totalSavings").textContent = allowance - totalSpent;
  document.getElementById("totalOweMe").textContent = totalOweMe;
  document.getElementById("totalIOwe").textContent = totalIOwe;
}

// Initialize pie chart with legend
let ctx = document.getElementById("expenseChart").getContext("2d");
let expenseChart = new Chart(ctx, {
  type: "pie",
  data: {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ["#D2B48C", "#8B5A2B", "#C68642", "#603C2C", "#9C6644"]
    }]
  },
  options: {
    plugins: {
      legend: { display: true, position: "top" } // Show legend
    }
  }
});

// Update the pie chart with expense data
function updateChart() {
  expenseChart.data.labels = Object.keys(expenses);
  expenseChart.data.datasets[0].data = Object.values(expenses);
  expenseChart.update();
}
