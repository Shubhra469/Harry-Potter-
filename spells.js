const API_BASE = 'http://localhost:3000/api';

document.addEventListener("DOMContentLoaded", () => {
  loadSpells();
  setupEventListeners();
});

function setupEventListeners() {
  const searchInput = document.getElementById("searchSpell");
  const filterType = document.getElementById("filterType");
  const sortBy = document.getElementById("sortBy");

  searchInput.addEventListener("input", loadSpells);
  filterType.addEventListener("input", loadSpells);
  sortBy.addEventListener("change", loadSpells);
}

async function loadSpells() {
  try {
    const search = document.getElementById("searchSpell").value;
    const type = document.getElementById("filterType").value;
    const sortBy = document.getElementById("sortBy").value;

    let url = `${API_BASE}/spells?`;
    if (search) url += `search=${search}&`;
    if (type) url += `type=${type}&`;
    if (sortBy) url += `sortBy=${sortBy}`;

    const response = await fetch(url);
    const result = await response.json();

    if (result.success) {
      displaySpells(result.data);
      console.log('Spells loaded:', result.data);
    } else {
      console.error('Error loading spells');
    }
  } catch (err) {
    console.error('Error:', err);
    // Fallback to local data if backend is not available
    loadLocalSpells();
  }
}

function displaySpells(spells) {
  const container = document.getElementById("spellsContainer");
  container.innerHTML = "";

  if (spells.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: white; padding: 40px;">No spells found</p>';
    return;
  }

  spells.forEach(spell => {
    const card = document.createElement("div");
    card.classList.add("spell-card");

    card.innerHTML = `
      <h3>${spell.name}</h3>
      <p><strong>Type:</strong> ${spell.type}</p>
      <p>${spell.description}</p>
    `;

    container.appendChild(card);
  });
}

function loadLocalSpells() {
  const spells = [
    {
      name: "Expelliarmus",
      type: "Charm",
      description: "Disarms your opponent."
    },
    {
      name: "Lumos",
      type: "Charm",
      description: "Creates a beam of light from the wand tip."
    },
    {
      name: "Avada Kedavra",
      type: "Curse",
      description: "Causes instant, painless death."
    },
    {
      name: "Wingardium Leviosa",
      type: "Charm",
      description: "Makes objects levitate."
    },
    {
      name: "Expecto Patronum",
      type: "Defensive Charm",
      description: "Summons a Patronus to ward off Dementors."
    }
  ];

  displaySpells(spells);
}
