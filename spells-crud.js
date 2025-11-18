const API_BASE = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  loadSpells();
  setupEventListeners();
});

function setupEventListeners() {
  const form = document.getElementById('addSpellForm');
  const modal = document.getElementById('editModal');
  const closeBtn = document.querySelector('.close');
  const editForm = document.getElementById('editSpellForm');
  const searchInput = document.getElementById('searchInput');
  const filterType = document.getElementById('filterType');
  const sortBy = document.getElementById('sortBy');
  const sortOrder = document.getElementById('sortOrder');
  const resetBtn = document.getElementById('resetBtn');

  form.addEventListener('submit', addSpell);
  editForm.addEventListener('submit', updateSpell);
  closeBtn.addEventListener('click', () => modal.style.display = 'none');
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.style.display = 'none';
  });

  searchInput.addEventListener('input', loadSpells);
  filterType.addEventListener('input', loadSpells);
  sortBy.addEventListener('change', loadSpells);
  sortOrder.addEventListener('change', loadSpells);
  resetBtn.addEventListener('click', resetFilters);
}

async function loadSpells() {
  try {
    const search = document.getElementById('searchInput').value;
    const type = document.getElementById('filterType').value;
    const sortBy = document.getElementById('sortBy').value;
    const sortOrder = document.getElementById('sortOrder').value;

    let url = `${API_BASE}/spells?`;
    if (search) url += `search=${search}&`;
    if (type) url += `type=${type}&`;
    if (sortBy) url += `sortBy=${sortBy}&order=${sortOrder}`;

    const response = await fetch(url);
    const result = await response.json();

    if (result.success) {
      displaySpells(result.data);
    } else {
      alert('Error loading spells');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

function displaySpells(spells) {
  const container = document.getElementById('spellsList');
  container.innerHTML = '';

  if (spells.length === 0) {
    container.innerHTML = '<p>No spells found</p>';
    return;
  }

  spells.forEach(spell => {
    const card = document.createElement('div');
    card.classList.add('list-card');
    card.innerHTML = `
      <div class="card-content">
        <h3>${spell.name}</h3>
        <p><strong>Type:</strong> ${spell.type}</p>
        <p>${spell.description}</p>
      </div>
      <div class="card-actions">
        <button class="btn-edit" onclick="openEditModal('${spell._id}', ${JSON.stringify(spell).replace(/"/g, '&quot;')})">Edit</button>
        <button class="btn-delete" onclick="deleteSpell('${spell._id}')">Delete</button>
      </div>
    `;
    container.appendChild(card);
  });
}

async function addSpell(e) {
  e.preventDefault();

  const spell = {
    name: document.getElementById('name').value,
    type: document.getElementById('type').value,
    description: document.getElementById('description').value
  };

  try {
    const response = await fetch(`${API_BASE}/spells`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spell)
    });

    const result = await response.json();
    if (result.success) {
      alert('Spell added successfully!');
      document.getElementById('addSpellForm').reset();
      loadSpells();
    } else {
      alert('Error: ' + result.error);
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Error adding spell');
  }
}

function openEditModal(id, spell) {
  const modal = document.getElementById('editModal');
  document.getElementById('editId').value = id;
  document.getElementById('editName').value = spell.name;
  document.getElementById('editType').value = spell.type;
  document.getElementById('editDescription').value = spell.description;
  modal.style.display = 'block';
}

async function updateSpell(e) {
  e.preventDefault();

  const id = document.getElementById('editId').value;
  const spell = {
    name: document.getElementById('editName').value,
    type: document.getElementById('editType').value,
    description: document.getElementById('editDescription').value
  };

  try {
    const response = await fetch(`${API_BASE}/spells/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(spell)
    });

    const result = await response.json();
    if (result.success) {
      alert('Spell updated successfully!');
      document.getElementById('editModal').style.display = 'none';
      loadSpells();
    } else {
      alert('Error: ' + result.error);
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Error updating spell');
  }
}

async function deleteSpell(id) {
  if (!confirm('Are you sure you want to delete this spell?')) return;

  try {
    const response = await fetch(`${API_BASE}/spells/${id}`, {
      method: 'DELETE'
    });

    const result = await response.json();
    if (result.success) {
      alert('Spell deleted successfully!');
      loadSpells();
    } else {
      alert('Error: ' + result.error);
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Error deleting spell');
  }
}

function resetFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('filterType').value = '';
  document.getElementById('sortBy').value = '';
  document.getElementById('sortOrder').value = 'asc';
  loadSpells();
}
