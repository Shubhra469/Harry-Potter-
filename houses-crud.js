const API_BASE = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  loadHouses();
  setupEventListeners();
});

function setupEventListeners() {
  const form = document.getElementById('addHouseForm');
  const modal = document.getElementById('editModal');
  const closeBtn = document.querySelector('.close');
  const editForm = document.getElementById('editHouseForm');
  const searchInput = document.getElementById('searchInput');
  const filterHead = document.getElementById('filterHead');
  const sortBy = document.getElementById('sortBy');
  const sortOrder = document.getElementById('sortOrder');
  const resetBtn = document.getElementById('resetBtn');

  form.addEventListener('submit', addHouse);
  editForm.addEventListener('submit', updateHouse);
  closeBtn.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  searchInput.addEventListener('input', loadHouses);
  filterHead.addEventListener('input', loadHouses);
  sortBy.addEventListener('change', loadHouses);
  sortOrder.addEventListener('change', loadHouses);
  resetBtn.addEventListener('click', resetFilters);
}

async function loadHouses() {
  try {
    const search = document.getElementById('searchInput').value;
    const head = document.getElementById('filterHead').value;
    const sortBy = document.getElementById('sortBy').value;
    const sortOrder = document.getElementById('sortOrder').value;

    let url = `${API_BASE}/houses?`;
    if (search) url += `search=${search}&`;
    if (head) url += `head=${head}&`;
    if (sortBy) url += `sortBy=${sortBy}&order=${sortOrder}`;

    const response = await fetch(url);
    const result = await response.json();

    if (result.success) {
      displayHouses(result.data);
    } else {
      alert('Error loading houses');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

function displayHouses(houses) {
  const container = document.getElementById('housesList');
  container.innerHTML = '';

  if (houses.length === 0) {
    container.innerHTML = '<p>No houses found</p>';
    return;
  }

  houses.forEach(house => {
    const card = document.createElement('div');
    card.classList.add('list-card');
    card.innerHTML = `
      <div class="card-content">
        <h3>${house.name}</h3>
        <p><strong>Head:</strong> ${house.head || 'N/A'}</p>
        <p><strong>Symbol:</strong> ${house.symbol || 'N/A'}</p>
        <p><strong>Colors:</strong> ${house.colors || 'N/A'}</p>
        <p><strong>Traits:</strong> ${house.traits ? house.traits.join(', ') : 'N/A'}</p>
        <p>${house.description || ''}</p>
      </div>
      <div class="card-actions">
        <button class="btn-edit" onclick="openEditModal('${house._id}', ${JSON.stringify(house).replace(/"/g, '&quot;')})">Edit</button>
        <button class="btn-delete" onclick="deleteHouse('${house._id}')">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
}

async function addHouse(e) {
  e.preventDefault();

  const house = {
    name: document.getElementById('name').value,
    colors: document.getElementById('colors').value,
    symbol: document.getElementById('symbol').value,
    head: document.getElementById('head').value,
    traits: document.getElementById('traits').value.split(',').map(t => t.trim()),
    description: document.getElementById('description').value
  };

  try {
    const response = await fetch(`${API_BASE}/houses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(house)
    });

    const result = await response.json();
    if (result.success) {
      alert('House added successfully!');
      document.getElementById('addHouseForm').reset();
      loadHouses();
    } else {
      alert('Error: ' + result.error);
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Error adding house');
  }
}

function openEditModal(id, house) {
  const modal = document.getElementById('editModal');
  document.getElementById('editId').value = id;
  document.getElementById('editName').value = house.name;
  document.getElementById('editColors').value = house.colors || '';
  document.getElementById('editSymbol').value = house.symbol || '';
  document.getElementById('editHead').value = house.head || '';
  document.getElementById('editTraits').value = house.traits ? house.traits.join(', ') : '';
  document.getElementById('editDescription').value = house.description || '';
  modal.style.display = 'block';
}

async function updateHouse(e) {
  e.preventDefault();

  const id = document.getElementById('editId').value;
  const house = {
    name: document.getElementById('editName').value,
    colors: document.getElementById('editColors').value,
    symbol: document.getElementById('editSymbol').value,
    head: document.getElementById('editHead').value,
    traits: document.getElementById('editTraits').value.split(',').map(t => t.trim()),
    description: document.getElementById('editDescription').value
  };

  try {
    const response = await fetch(`${API_BASE}/houses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(house)
    });

    const result = await response.json();
    if (result.success) {
      alert('House updated successfully!');
      document.getElementById('editModal').style.display = 'none';
      loadHouses();
    } else {
      alert('Error: ' + result.error);
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Error updating house');
  }
}

async function deleteHouse(id) {
  if (!confirm('Are you sure you want to delete this house?')) return;

  try {
    const response = await fetch(`${API_BASE}/houses/${id}`, {
      method: 'DELETE'
    });

    const result = await response.json();
    if (result.success) {
      alert('House deleted successfully!');
      loadHouses();
    } else {
      alert('Error: ' + result.error);
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Error deleting house');
  }
}

function resetFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('filterHead').value = '';
  document.getElementById('sortBy').value = '';
  document.getElementById('sortOrder').value = 'asc';
  loadHouses();
}
