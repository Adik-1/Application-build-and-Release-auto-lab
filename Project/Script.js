const checkButton = document.querySelector("#check-button");
const checkResult = document.querySelector("#check-result");

checkButton.addEventListener("click", async () => {
    checkButton.disabled = true;
    checkButton.setAttribute("aria-busy", "true");
    checkResult.textContent = "Checking the application...";

    try {
        const response = await fetch(window.location.href, { cache: "no-store" });
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }
        checkResult.textContent = "All good — the application is responding.";
    } catch (error) {
        checkResult.textContent = `Deployment check failed: ${error.message}`;
    } finally {
        checkButton.disabled = false;
        checkButton.removeAttribute("aria-busy");
    }
});
