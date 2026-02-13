var storedOrders = JSON.parse(localStorage.getItem('eomm_orders') || '[]');

// --- Global Functions (Explicitly defined on window) ---

window.checkPassword = function (event) {
    if (event) event.preventDefault();
    var passwordInput = document.getElementById('password').value;

    if (passwordInput === 'admin123') { // Simple Password
        document.getElementById('loginSection').classList.add('hidden');
        document.getElementById('dashboardSection').classList.remove('hidden');
        window.renderTable();
    } else {
        document.getElementById('errorMsg').classList.remove('hidden');
    }
};

window.renderTable = function () {
    var tableBody = document.getElementById('ordersTableBody');
    var noDataMsg = document.getElementById('noDataMsg');

    // Use the cloud database helper
    DATABASE.getOrders(function (orders) {
        tableBody.innerHTML = '';

        if (orders.length === 0) {
            noDataMsg.classList.remove('hidden');
            return;
        }

        noDataMsg.classList.add('hidden');

        orders.forEach(function (order, index) {
            var row = document.createElement('tr');
            row.className = "hover:bg-gray-50 border-b transition";
            if (order.isStudent) row.className += " bg-purple-50";

            var dateStr = 'N/A';
            try { dateStr = new Date(order.date).toLocaleString(); } catch (e) { }

            var addressShort = (order.address || '').length > 30 ? order.address.substring(0, 30) + '...' : (order.address || 'N/A');

            var imageBtn = order.slipImage
                ? `<button onclick="viewImage('${order.slipImage}')" class="text-primary hover:text-purple-900 font-bold underline transition">View Slip</button>`
                : '<span class="text-xs text-gray-400 italic">No Upload</span>';

            var nameDisplay = order.name;
            if (order.isStudent) {
                nameDisplay += ' <span class="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full border border-purple-200">Student</span>';
            }

            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${dateStr}</td>
                <td class="px-6 py-4 font-medium text-gray-900">${nameDisplay}</td>
                <td class="px-6 py-4 text-gray-500">${order.mobile}</td>
                <td class="px-6 py-4 text-gray-500 truncate max-w-xs cursor-help" title="${order.address}">${addressShort}</td>
                <td class="px-6 py-4">
                    ${imageBtn}
                </td>
            `;
            tableBody.appendChild(row);
        });
    });
};

window.viewImage = function (base64) {
    if (base64) {
        document.getElementById('modalImage').src = base64;
        document.getElementById('imageModal').classList.remove('hidden');
    } else {
        alert('Image not found.');
    }
};

window.closeImageModal = function () {
    document.getElementById('imageModal').classList.add('hidden');
};

window.clearData = function () {
    if (confirm("Are you sure you want to delete ALL orders? This cannot be undone.")) {
        localStorage.removeItem('eomm_orders');
        window.renderTable();
    }
};

window.logout = function () {
    location.reload();
};

// Bind form submit manually just in case
document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', window.checkPassword);
    }
});
