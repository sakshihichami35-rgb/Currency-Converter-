const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const fromLanguage = document.getElementById("fromLanguage");
const toLanguage = document.getElementById("toLanguage");
const translateBtn = document.getElementById("translateBtn");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const swapBtn = document.getElementById("swapBtn");
const status = document.getElementById("status");

// Translate text
translateBtn.addEventListener("click", async () => {
  const text = inputText.value.trim();
  const from = fromLanguage.value;
  const to = toLanguage.value;

  if (!text) {
    status.textContent = "Please enter some text.";
    return;
  }

  if (from === to) {
    outputText.value = text;
    status.textContent = "Both languages are the same.";
    return;
  }

  translateBtn.disabled = true;
  translateBtn.textContent = "Translating...";
  status.textContent = "Please wait...";

  try {
    const url =
      "https://api.mymemory.translated.net/get?q=" +
      encodeURIComponent(text) +
      "&langpair=" + encodeURIComponent(from + "|" + to);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network error");
    }

    const data = await response.json();

    if (data.responseStatus !== 200 ||
        !data.responseData?.translatedText) {
      throw new Error("Translation unavailable");
    }

    outputText.value = data.responseData.translatedText;
    status.textContent = "Translation completed!";
  } catch (error) {
    status.textContent =
      "Translation failed. Check your internet and try again.";
  } finally {
    translateBtn.disabled = false;
    translateBtn.textContent = "Translate";
  }
});

// Swap languages and text
swapBtn.addEventListener("click", () => {
  const oldLanguage = fromLanguage.value;

  fromLanguage.value = toLanguage.value;
  toLanguage.value = oldLanguage;

  const oldText = inputText.value;
  inputText.value = outputText.value;
  outputText.value = oldText;

  status.textContent = "";
});

// Copy translated text
copyBtn.addEventListener("click", async () => {
  if (!outputText.value) {
    status.textContent = "Nothing to copy.";
    return;
  }

  try {
    await navigator.clipboard.writeText(outputText.value);
    status.textContent = "Translation copied!";
  } catch (error) {
    outputText.select();
    status.textContent =
      "Select and copy the translated text manually.";
  }
});

// Clear both text boxes
clearBtn.addEventListener("click", () => {
  inputText.value = "";
  outputText.value = "";
  status.textContent = "";
});

// Allow Ctrl+Enter to translate
inputText.addEventListener("keydown", (event) => {
  if (event.ctrlKey && event.key === "Enter") {
    translateBtn.click();
  }
});