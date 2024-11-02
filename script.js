let items = [];

function addItem() {
    const itemName = document.getElementById('item-name').value;
    const itemPrice = parseFloat(document.getElementById('item-price').value);
    const itemQuantity = parseInt(document.getElementById('item-quantity').value);

    if (itemName && itemPrice > 0 && itemQuantity > 0) {
        const itemTotal = itemPrice * itemQuantity;
        const currentDateTime = new Date().toLocaleString(); // Get current date and time

        const item = {
            name: itemName,
            price: itemPrice,
            quantity: itemQuantity,
            total: itemTotal,
            dateTime: currentDateTime // Store date and time
        };

        items.push(item);
        renderTable();
        calculateTotal();

        // Clear form fields
        document.getElementById('item-name').value = '';
        document.getElementById('item-price').value = '';
        document.getElementById('item-quantity').value = '';
    } else {
        alert('Please enter valid item details.');
    }
}

function renderTable() {
    const tableBody = document.querySelector('#billing-table tbody');
    tableBody.innerHTML = '';

    items.forEach((item, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${item.name}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>₹${item.total.toFixed(2)}</td>
            <td>${item.dateTime}</td>
            <td><button class="remove-btn" onclick="removeItem(${index})">Remove</button></td>
        `;

        tableBody.appendChild(row);
    });
}

function saveProducts() {
    if (items.length === 0) {
        alert("No products to save.");
        return;
    }

    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Item Name,Price (₹),Quantity,Total (₹),Date & Time\n";

    items.forEach(item => {
        csvContent += `${item.name},${item.price.toFixed(2)},${item.quantity},${item.total.toFixed(2)},${item.dateTime}\n`;
    });

    // Encode URI
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");

    // Set the file name and trigger download
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sold_products.csv");
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
}

function removeItem(index) {
    const confirmRemoval = confirm("Are you sure you want to remove this item?");
    
    if (confirmRemoval) {
        items.splice(index, 1);
        renderTable();
        calculateTotal();
    }
}


function calculateTotal() {
    let subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discount = parseFloat(document.getElementById('discount').value) || 0;
    const tax = parseFloat(document.getElementById('tax').value) || 0;

    const discountAmount = (discount / 100) * subtotal;
    const taxAmount = (tax / 100) * (subtotal - discountAmount);
    const totalAmount = subtotal - discountAmount + taxAmount;

    document.getElementById('total-amount').textContent = `Total: ₹${totalAmount.toFixed(2)}`;
}
