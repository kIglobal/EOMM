document.addEventListener('DOMContentLoaded', () => {

    const orderForm = document.getElementById('orderForm');
    const fileInput = document.getElementById('file-upload');
    const fileNameDisplay = document.getElementById('file-name');
    const successModal = document.getElementById('successModal');

    // Create new function scope helper
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files.length > 0 && fileNameDisplay) {
                fileNameDisplay.textContent = `Selected: ${files[0].name}`;
                fileNameDisplay.classList.remove('hidden');
            } else if (fileNameDisplay) {
                fileNameDisplay.classList.add('hidden');
            }
        });
    }

    // Explicitly attach closeModal
    window.closeModal = function () {
        if (successModal) {
            successModal.classList.add('hidden');
            // Optionally redirect
            window.location.href = 'index.html';
        }
    };

    if (orderForm) {
        orderForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const nameVal = document.getElementById('name').value;
            const mobileVal = document.getElementById('mobile').value;
            const addressVal = document.getElementById('address').value;
            const file = fileInput.files[0];
            const btn = orderForm.querySelector('button[type="submit"]');

            if (!file) {
                alert("Please upload the slip.");
                return;
            }

            const originalText = btn.textContent;
            btn.textContent = 'Processing...';
            btn.disabled = true;

            const reader = new FileReader();

            reader.onload = function (evt) {
                const base64 = evt.target.result;

                const orderData = {
                    id: Date.now(),
                    date: new Date().toISOString(),
                    name: nameVal,
                    mobile: mobileVal,
                    address: addressVal,
                    slipImage: base64
                };

                try {
                    let orders = JSON.parse(localStorage.getItem('eomm_orders') || '[]');
                    orders.push(orderData);
                    localStorage.setItem('eomm_orders', JSON.stringify(orders));

                    // Success
                    setTimeout(() => {
                        if (successModal) successModal.classList.remove('hidden');
                        btn.textContent = originalText;
                        btn.disabled = false;
                        orderForm.reset();
                        if (fileNameDisplay) fileNameDisplay.classList.add('hidden');
                    }, 500);

                } catch (err) {
                    console.error("Storage Full", err);
                    alert("Order saved, but the image was too large for browser storage.");

                    let orders = JSON.parse(localStorage.getItem('eomm_orders') || '[]');
                    orderData.slipImage = null; // Removed image
                    orders.push(orderData);
                    localStorage.setItem('eomm_orders', JSON.stringify(orders));

                    setTimeout(() => {
                        if (successModal) successModal.classList.remove('hidden');
                        btn.textContent = originalText;
                        btn.disabled = false;
                        orderForm.reset();
                        if (fileNameDisplay) fileNameDisplay.classList.add('hidden');
                    }, 500);
                }
            };

            reader.readAsDataURL(file);
        });
    }
});
