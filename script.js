const container = document .querySelector('.container'),
form = container.querySelector('form'),
fileInput = form.querySelector('input[type="file"]'),
previewImage = form.querySelector('#preview'),
closeBtn = document.querySelector('.close'),
copyBtn = document.querySelector('.copy');

function sendQR(fileData) {
      fetch("https://api.qrserver.com/v1/read-qr-code/", {
        method: "POST",
        body: fileData
      }).then(res => res.json())
        .then(data => {
          container.classList.add("active");
          const output = document.querySelector("textarea");
          if (data && data[0]?.symbol[0]?.data) {
            output.textContent = data[0].symbol[0].data;
          } else {
            output.textContent = "No QR code data found.";
          }
        }).catch(() => {
          document.querySelector("textarea").textContent = "Failed to scan QR code.";
        });
    }

fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
        previewImage.src = reader.result;
    };
    reader.readAsDataURL(file);
    const formData = new FormData();
    formData.append("file", file);
    sendQR(formData);
});
form.addEventListener('click', () => fileInput.click());
closeBtn.addEventListener("click", () => {
    container.classList.remove("active");
    fileInput.value = "";
    previewImage.src = "";
    document.querySelector("textarea").textContent = "Scan result will appear here...";
});
copyBtn.addEventListener("click", () => {
    const textArea = document.querySelector("textarea");
    navigator.clipboard.writeText(textArea.value).then(() => {
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
            copyBtn.textContent = "Copy Text";
        }, 2000);
    }).catch(() => {
        alert("Failed to copy text.");
    });
});
