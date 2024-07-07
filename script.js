// Function to check for errors
function checkForErrors() {
    let hasError = false;

    // Check each input field
    ['amount', 'term', 'interest'].forEach(function(id) {
        let input = document.getElementById(id);
        if (!input.value.trim()) {
            input.parentElement.classList.add('error');
            hasError = true;
        } else {
            input.parentElement.classList.remove('error');
        }
    });

    // Check radio buttons
    let radioChecked = document.querySelector('input[name="type"]:checked');
    if (!radioChecked) {
        document.querySelector('.radio-container').classList.add('error');
        hasError = true;
    } else {
        document.querySelector('.radio-container').classList.remove('error');
    }

    return hasError;
}

// Function to update radio item styles
function updateRadioItemStyles() {
    document.querySelectorAll('.radio-item').forEach(item => {
        const radio = item.querySelector('input[type="radio"]');
        if (radio.checked) {
            item.classList.add('selected');
        } else {
            item.classList.remove('selected');
        }
    });
}

// Event listener for calculate button
document.getElementById('calculate').addEventListener('click', function(e) {
    e.preventDefault();
    if (!checkForErrors()) {
        calculateRepayments();
    }
});

// Remove error state on input
document.querySelectorAll('input').forEach(function(input) {
    input.addEventListener('input', function() {
        this.parentElement.classList.remove('error');
    });
});

// Remove error state on radio button selection and update styles
document.querySelectorAll('input[type="radio"]').forEach(function(radio) {
    radio.addEventListener('change', function() {
        document.querySelector('.radio-container').classList.remove('error');
        updateRadioItemStyles();
    });
});

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function calculateRepayments() {
    // Get input values
    const amount = parseFloat(document.getElementById('amount').value.replace(/,/g, ''));
    const term = parseInt(document.getElementById('term').value);
    const interest = parseFloat(document.getElementById('interest').value);
    const type = document.querySelector('input[name="type"]:checked').value;

    // Perform calculations based on mortgage type
    let monthlyRepayment;
    let totalRepayment;
    if (type === 'repayment') {
        // Calculate repayment mortgage
        const monthlyInterestRate = interest / 100 / 12;
        const numberOfPayments = term * 12;
        monthlyRepayment = (amount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);
        totalRepayment = monthlyRepayment * numberOfPayments;
    } else {
        // Calculate interest-only mortgage
        monthlyRepayment = (amount * (interest / 100)) / 12;
        totalRepayment = amount + (monthlyRepayment * term * 12);
    }

    // Display results
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = `
        <h3>Your results</h3>
        <p>Your results are shown below based on the information you provided. To adjust the results, edit the form and click "calculate repayments" again.</p>
        <div class="result-box">
            <div class="result-highlight"></div>
            <div class="result-item">
                <p>Your monthly repayments</p>
                <p id="monthly-repayments">£${formatNumber(monthlyRepayment.toFixed(2))}</p>
            </div>
            <div class="result-divider"></div>
            <div class="result-item">
                <p>Total you'll repay over the term</p>
                <p id="total-repayment">£${formatNumber(totalRepayment.toFixed(2))}</p>
            </div>
        </div>
    `;
    resultsContainer.classList.add('calculated');

    // Add more space above the button
    document.getElementById('calculate').style.marginTop = '20px';
}

function clearAll() {
    // Clear input fields
    document.getElementById('amount').value = '';
    document.getElementById('term').value = '';
    document.getElementById('interest').value = '';

    // Uncheck all radio buttons
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.checked = false;
    });

    // Update radio item styles
    updateRadioItemStyles();

    // Reset results
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = `
        <img src="illustration-empty.svg" alt="Large Image" class="large-image">
        <h3>Results shown here</h3>
        <p>Complete the form and click "calculate repayments" to see what your monthly repayments would be.</p>
    `;
    resultsContainer.classList.remove('calculated');

    // Remove all error states
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    // Reset button margin
    document.getElementById('calculate').style.marginTop = '';
}

document.getElementById('clear-all').addEventListener('click', clearAll);

// Allow commas in input fields
document.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9.,]/g, '');
        this.value = formatNumber(this.value.replace(/,/g, ''));
    });
});

// Call updateRadioItemStyles on page load
document.addEventListener('DOMContentLoaded', updateRadioItemStyles);
