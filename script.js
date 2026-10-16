
const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");
const result = document.getElementById("result");
const rateText = document.getElementById("rate");
const message = document.getElementById("message");

async function convertCurrency() {
  const amount = Number(amountInput.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  message.textContent = "";
  result.textContent = "--";
  rateText.textContent = "";

  if (amountInput.value.trim() === "" ||
      !Number.isFinite(amount) || amount < 0) {
    message.textContent = "Please enter a valid amount.";
    return;
  }

  convertBtn.disabled = true;
  convertBtn.textContent = "Converting...";

  try {
    let exchangeRate = 1;
    let rateDate = "Same currency";

    if (from !== to) {
     const url =
  `https://api.frankfurter.dev/v1/latest?from=${from}&to=${to}`;

const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Unable to fetch exchange rates.");
      }

      const data = await response.json();
      exchangeRate = data.rates[to];
      rateDate = data.date;

      if (!Number.isFinite(exchangeRate)) {
        throw new Error("Exchange rate is unavailable.");
      }
    }

    const convertedAmount = amount * exchangeRate;

    result.textContent = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: to,
      maximumFractionDigits: 4
    }).format(convertedAmount);

    rateText.textContent =
      `1 ${from} = ${exchangeRate.toFixed(6)} ${to}`;

    if (from !== to) {
      message.style.color = "#64748b";
      message.textContent = `Rate date: ${rateDate}`;
    }
  } catch (error) {
    message.style.color = "#dc2626";
    message.textContent =
      "Could not get exchange rates. Please try again.";
  } finally {
    convertBtn.disabled = false;
    convertBtn.textContent = "Convert Currency";
  }
}

swapBtn.addEventListener("click", () => {
  const previousCurrency = fromCurrency.value;

  fromCurrency.value = toCurrency.value;
  toCurrency.value = previousCurrency;

  convertCurrency();
});

convertBtn.addEventListener("click", convertCurrency);

amountInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    convertCurrency();
  }
});

// Show the initial conversion when the page opens.
convertCurrency();
