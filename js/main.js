/* Location Data */
const locations = {
  lodi: {
    name: "Lodi",
    address: "123 Cherry Ln, Lodi, CA",
    phone: "(209) 555-1234",
    hours: "Mon-Thu 11:00 AM – 9:00 PM | Fri-Sat 11:00 AM – 10:00 PM | Sun 12:00 PM – 8:00 PM",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d..." // placeholder URL
  },
  stockton: {
    name: "Stockton",
    address: "456 Pacific Ave, Stockton, CA",
    phone: "(209) 555-5678",
    hours: "Mon-Thu 11:00 AM – 9:00 PM | Fri-Sat 11:00 AM – 10:00 PM | Sun 12:00 PM – 8:00 PM",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d..."
  },
  discovery_bay: {
    name: "Discovery Bay",
    address: "789 Marina Blvd, Discovery Bay, CA",
    phone: "(925) 555-2468",
    hours: "Mon-Thu 11:00 AM – 9:00 PM | Fri-Sat 11:00 AM – 10:00 PM | Sun 12:00 PM – 8:00 PM",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d..."
  },
  galt: {
    name: "Galt",
    address: "101 Oak St, Galt, CA",
    phone: "(209) 555-9876",
    hours: "Mon-Thu 11:00 AM – 9:00 PM | Fri-Sat 11:00 AM – 10:00 PM | Sun 12:00 PM – 8:00 PM",
    map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d..."
  }
};

const locationSelect = document.getElementById("locationSelect");
const locationDetails = document.getElementById("locationDetails");
const inlineSelect = document.getElementById('locationSelectInline');

function renderLocationDetails(key) {
  if(!locationDetails) return; // element removed; skip
  const loc = locations[key];
  if (!loc) return;
  locationDetails.innerHTML = `
    <h3>${loc.name}</h3>
    <p><strong>Address:</strong> ${loc.address}</p>
    <p><strong>Hours:</strong> ${loc.hours}</p>
    <a href="tel:${loc.phone.replace(/[^0-9]/g, "")}" class="btn tertiary">Call ${loc.phone}</a>
    <div class="map-wrap"><iframe src="${loc.map}" allowfullscreen loading="lazy"></iframe></div>
  `;
}

function syncSelectors(value){
  locationSelect.value = value;
  inlineSelect.value = value;
}

/* Initial render */
renderLocationDetails(locationSelect.value);

/* Handle location change */
locationSelect.addEventListener("change", (e) => {
  renderLocationDetails(e.target.value);
});

/* Menu Rendering & Filtering */
const menuGrid = document.querySelector(".menu-grid");
const filterButtons = document.querySelectorAll(".filter-btn");
const menuNoticeElem = document.getElementById('menuNotice');

function renderMenu(items) {
  menuGrid.innerHTML = items.map(item => `
    <div class="menu-item" data-category="${item.category}">
      <div class="menu-item-header">
        <h3>${item.name}</h3>
        <span class="price">${item.price}</span>
      </div>
      <p class="description">${item.description}</p>
    </div>
  `).join('');
}

function getCurrentLocationKey() {
  return locationSelect.value; // lodi / stockton / discovery_bay / galt
}

function updateMenuNotice() {
  if (getCurrentLocationKey() === 'discovery_bay') {
    menuNoticeElem.textContent = 'Note: Beef Teriyaki Entrée, Beef Teriyaki Don and Beef Teriyaki options are not available at our Discovery Bay location.';
    menuNoticeElem.style.display = 'block';
  } else {
    menuNoticeElem.style.display = 'none';
  }
}

function filterAndRenderMenu(filter) {
  const currentLoc = getCurrentLocationKey();
  const allItems = Object.keys(menuData).flatMap(category =>
    menuData[category].map(item => ({ ...item, category }))
  );

  // Keep if item.locations is undefined OR includes currentLoc
  const locItems = allItems.filter(item => {
    if (!item.locations) return true;
    return item.locations.includes(currentLoc);
  });

  const filteredItems = filter === 'all'
    ? locItems
    : locItems.filter(item => item.category === filter);

  const processed = filteredItems.map(i=>{
    if(currentLoc==='discovery_bay'){
      const clone={...i};
      if(clone.description){
        clone.description = clone.description.replace(/,? ?Beef Teriyaki\*?/gi,'').replace(/  +/g,' ').trim();
      }
      if(clone.notes){
        clone.notes='';
      }
      return clone;
    }
    return i;
  });

  renderMenu(processed);
  updateMenuNotice();
}

filterButtons.forEach((btn) => btn.addEventListener("click", () => {
  document.querySelector(".filter-btn.active").classList.remove("active");
  btn.classList.add("active");
  filterAndRenderMenu(btn.dataset.filter);
}));

/* Re-render menu when location changes */
locationSelect.addEventListener("change", () => {
  const activeFilter = document.querySelector(".filter-btn.active").dataset.filter;
  filterAndRenderMenu(activeFilter);
});

/* Initial Menu Render */
// Fetch menu JSON and initialize
let menuData = {};

fetch('data/menus.json')
  .then(res => res.json())
  .then(json => {
    menuData = json;
    // after data is loaded, render menu
    filterAndRenderMenu('all');
  })
  .catch(err => console.error('Failed to load menu data', err));


/* Mobile Nav Toggle */
const navToggle = document.querySelector(".mobile-nav-toggle");
const mainNav = document.querySelector(".main-nav");

navToggle.addEventListener("click", () => {
  mainNav.classList.toggle("open");
});

// initial sync
syncSelectors(locationSelect.value);

// when header select changes (already has listener) extend existing callback
locationSelect.addEventListener('change', e=>{
  syncSelectors(e.target.value);
});

// inline select change
inlineSelect.addEventListener('change', e=>{
  syncSelectors(e.target.value);
  renderLocationDetails(e.target.value);
  const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
  filterAndRenderMenu(activeFilter);
}); 

/* Slideshow */
const slides=[
  {src:'https://0201.nccdn.net/1_2/000/000/17e/130/sushi2-317x320.JN8wpsbLk.png',cap:'Signature Matsuyama Roll'},
  {src:'https://0201.nccdn.net/1_2/000/000/177/867/sushi5.png',cap:'Bonsai Roll'},
  {src:'https://0201.nccdn.net/1_2/000/000/09d/f93/sushi6-640x376.1kpgL4inM.png',cap:'Jungle (left) & Lion (right) Roll'},
  {src:'https://0201.nccdn.net/1_2/000/000/0f3/51f/sushi7-480x360.vpgFBU1am.png',cap:'Tekka (Tuna) Donburi'},
  {src:'https://0201.nccdn.net/1_2/000/000/18d/fa3/sushi8-257x320.ungO0uNT5.png',cap:'Lion King Roll* (ask your server for availability)'},
  {src:'https://0201.nccdn.net/4_2/000/000/071/260/sushi3-480x307.vRAouLwK0.png',cap:'Salmon Teriyaki'},
  {src:'https://0201.nccdn.net/1_2/000/000/10b/a28/sushi1-480x336.jaEgcCM2n.png',cap:'Red Dragon Roll'}
];
let slideIdx=0;
const imgEl=document.getElementById('foodSlide');
const capEl=document.getElementById('foodCaption');
// Auto advance every 4 seconds
setInterval(()=>changeSlide(1),4000);
function changeSlide(dir){
  imgEl.classList.add('slide-exit');
  setTimeout(()=>{
    slideIdx=(slideIdx+dir+slides.length)%slides.length;
    const s=slides[slideIdx];
    imgEl.src=s.src;
    capEl.textContent=s.cap;
    imgEl.classList.remove('slide-exit');
  },600);
} 