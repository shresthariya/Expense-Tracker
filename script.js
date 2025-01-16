 
document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalAmount = document.getElementById("total-amount");
    const filterCategory = document.getElementById("filter-category");
    const expenseChartCanvas = document.getElementById("expenseChart");

    let expenses = [];
    let expenseChart;

     
    function updateChart(data) {
        const categories = ["Food", "Transport", "Entertainment", "Other"];
        const categoryTotals = categories.map(category => {
            return data
                .filter(expense => expense.category === category)
                .reduce((sum, expense) => sum + expense.amount, 0);
        });

        if (expenseChart) {
            expenseChart.destroy();
        }

        expenseChart = new Chart(expenseChartCanvas, {
            type: "bar",
            data: {
                labels: categories,
                datasets: [
                    {
                        label: "Expenses by Category",
                        data: categoryTotals,
                        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "top",
                    },
                },
            },
        });
    }
 
    function displayExpenses(data) {
        expenseList.innerHTML = "";
        data.forEach(expense => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${expense.name}</td>
                <td>$${expense.amount.toFixed(2)}</td>
                <td>${expense.category}</td>
                <td>${expense.date}</td>
                <td>
                    <button class="delete-btn" data-id="${expense.id}">Delete</button>
                </td>
            `;
            expenseList.appendChild(row);
        });
    }

     
    function updateTotalAmount() {
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        totalAmount.textContent = total.toFixed(2);
    }

     
    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("expense-name").value;
        const amount = parseFloat(document.getElementById("expense-amount").value);
        const category = document.getElementById("expense-category").value;
        const date = document.getElementById("expense-date").value;

        
        if (amount <= 0 || isNaN(amount)) {
            alert("Please enter a valid amount greater than 0.");
            return;  
        }

        const expense = {
            id: Date.now(),
            name,
            amount,
            category,
            date,
        };

        expenses.push(expense);
        displayExpenses(expenses);
        updateTotalAmount();
        updateChart(expenses);
        expenseForm.reset();
    });

     
    expenseList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const id = parseInt(e.target.dataset.id);
            expenses = expenses.filter(expense => expense.id !== id);
            displayExpenses(expenses);
            updateTotalAmount();
            updateChart(expenses);
        }
    });

     
    filterCategory.addEventListener("change", (e) => {
        const category = e.target.value;
        const filteredExpenses = category === "All" ? expenses : expenses.filter(expense => expense.category === category);
        displayExpenses(filteredExpenses);
        updateChart(filteredExpenses);
    });
});
