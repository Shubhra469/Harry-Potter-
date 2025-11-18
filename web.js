const API_BASE = 'http://localhost:3000/api';

document.addEventListener("DOMContentLoaded", async () => {
  const sortBtn = document.getElementById("sortBtn");
  const exploreBtn = document.getElementById("exploreBtn");
  const hogwartsLink = document.getElementById("hogwartsLink");
  const sortingSection = document.getElementById("sortingSection");
  const houseInfo = document.getElementById("houseInfo");
  const searchHouse = document.getElementById("searchHouse");

  const houseName = document.getElementById("houseName");
  const houseDescription = document.getElementById("houseDescription");
  const houseHead = document.getElementById("houseHead");
  const houseTraits = document.getElementById("houseTraits");
  const houseColors = document.getElementById("houseColors");
  const houseCrest = document.getElementById("houseCrest");

  let allHouses = [];

  // Load houses from backend
  async function loadHouses() {
    try {
      const response = await fetch(`${API_BASE}/houses`);
      const result = await response.json();
      if (result.success) {
        allHouses = result.data;
        console.log('Houses loaded:', allHouses);
        updateHouseDisplay();
      } else {
        loadLocalHouses();
      }
    } catch (err) {
      console.error('Error loading houses:', err);
      loadLocalHouses();
    }
  }

  // Fallback to local data
  function loadLocalHouses() {
    try {
      fetch("web.json")
        .then(res => res.json())
        .then(data => {
          allHouses = data.houses;
          updateHouseDisplay();
        });
    } catch (err) {
      alert("Couldn't load house data! 🪄");
      console.error(err);
    }
  }

  function updateHouseDisplay() {
    const housesContainer = document.querySelector(".houses");
    if (!housesContainer) return;

    housesContainer.innerHTML = '';
    allHouses.forEach(house => {
      const houseEl = document.createElement("div");
      houseEl.classList.add("house");
      houseEl.dataset.house = house.name;
      
      const crestMap = {
        Gryffindor: "G.png",
        Slytherin: "S.png",
        Ravenclaw: "R.png",
        Hufflepuff: "H.png"
      };
      const imageSrc = crestMap[house.name] || "";
      
      houseEl.innerHTML = `
        <img src="${imageSrc}" alt="${house.name}">
        <p>${house.name}</p>
      `;
      houseEl.addEventListener("click", () => showHouse(house));
      housesContainer.appendChild(houseEl);
    });
  }

  // Function to show selected house info
  function showHouse(houseData) {
    houseName.textContent = houseData.name;
    houseDescription.textContent = houseData.description;
    houseHead.textContent = houseData.head;
    houseTraits.textContent = houseData.traits ? houseData.traits.join(", ") : "N/A";
    houseColors.textContent = houseData.colors;

    const crestMap = {
      Gryffindor: "G.png",
      Slytherin: "S.png",
      Ravenclaw: "R.png",
      Hufflepuff: "H.png"
    };
    houseCrest.src = crestMap[houseData.name] || "";

    houseInfo.style.display = "block";
    houseInfo.scrollIntoView({ behavior: "smooth" });
  }

  // 🧙 Sort button → Random house
  sortBtn.addEventListener("click", () => {
    if (allHouses.length === 0) return;
    const randomHouse = allHouses[Math.floor(Math.random() * allHouses.length)];
    showHouse(randomHouse);
  });

  // 🏰 Navbar "Hogwarts Sorting" → Smooth scroll animation + glow
  hogwartsLink.addEventListener("click", (e) => {
    e.preventDefault();
    sortingSection.scrollIntoView({ behavior: "smooth" });

    sortingSection.classList.add("glow-effect");
    setTimeout(() => {
      sortingSection.classList.remove("glow-effect");
    }, 2000);
  });

  // Search houses
  if (searchHouse) {
    searchHouse.addEventListener("input", () => {
      const text = searchHouse.value.toLowerCase();
      const filtered = allHouses.filter(h =>
        h.name.toLowerCase().includes(text) ||
        h.description.toLowerCase().includes(text)
      );
      const housesContainer = document.querySelector(".houses");
      housesContainer.innerHTML = '';
      filtered.forEach(house => {
        const houseEl = document.createElement("div");
        houseEl.classList.add("house");
        houseEl.dataset.house = house.name;
        houseEl.innerHTML = `<p>${house.name}</p>`;
        houseEl.addEventListener("click", () => showHouse(house));
        housesContainer.appendChild(houseEl);
      });
    });
  }

  // ✨ Explore Spells placeholder
  exploreBtn.addEventListener("click", () => {
    window.location.href = "explore.html";
  });

  // Load initial data
  await loadHouses();
});
