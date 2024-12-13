const minPriceInput = document.getElementById('priceFrom');
const maxPriceInput = document.getElementById('priceTo');
const nameInput = document.getElementById('nameInput');

document
  .querySelector("#btnLoadProducts")
  .addEventListener("click", async () => {
    const minPrice = minPriceInput.value;
    const maxPrice = maxPriceInput.value;
    const name = nameInput.value;
    let url = `http://localhost:5500/api/products`;

      const params = new URLSearchParams();
      if (minPrice) params.append('priceFrom', minPrice);
      if (maxPrice) params.append('priceTo', maxPrice);
      if (name) params.append('name', name);
      console.log(url);
      if(params.toString()) 
      url += `?${params.toString()}`;
  

    try {
      const response = await fetch(url);
      const products = await response.json();
      console.log(products);
      displayProducts(products);
    } catch (error) {
      console.error("Error fetching products:", error); 
    }
  });

  document.getElementById('createProductForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('http://localhost:5500/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert('Product created successfully!');
        this.reset();
      } else {
        const errorText = await response.text();
        console.error('Failed to create product:', response.status, errorText);
        alert('Failed to create product.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the product.');
    }
  });

function displayProducts(products) {
  const productsList = document.getElementById("productsList");
  productsList.innerHTML = "";

  if (products.length === 0) {
    const noProductsItem = document.createElement("li");
    noProductsItem.classList.add("list-group-item");
    noProductsItem.textContent = "No Products found.";
    productsList.appendChild(noProductsItem);
    return;
  }

  products.forEach((product) => {
    const productItem = document.createElement("li");
    const deleteButton = document.createElement("button");
    productItem.classList.add("list-group-item");
    productItem.innerHTML = `${product.id} - ${product.name} - ${product.price}€ - ${product.description}`;
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('btn', 'btn-danger', 'delete-button');
    deleteButton.id = `deleteButton`;
    deleteButton.addEventListener('click', async () => {
      try {
        console.log(`Attempting to delete product with ID: ${product.id}`);
        const response = await fetch(`http://localhost:5500/api/products/${product.id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Product deleted successfully!');
          console.log(`Product with ID: ${product.id} deleted successfully`);
          productItem.remove();
        } else {
          alert('Failed to delete product.');
          console.error(`Failed to delete product with ID: ${product.id}`);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while deleting the product.');
      }
    });
    productItem.appendChild(deleteButton);
    productsList.appendChild(productItem);
  });
}
