const grid = document.getElementById("grid");
const filtersEl = document.getElementById("filters");
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCap = document.getElementById("lbCap");
let current = { images: [], index: 0, title: "" };

const categories = ["All", ...new Set(PROJECTS.map(p => p.category))];

function renderFilters() {
  filtersEl.innerHTML = "";
  categories.forEach((cat, i) => {
    const b = document.createElement("button");
    b.className = "filter" + (i === 0 ? " active" : "");
    b.textContent = cat;
    b.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach(f => f.classList.remove("active"));
      b.classList.add("active");
      renderGrid(cat);
    });
    filtersEl.appendChild(b);
  });
}

function renderGrid(cat) {
  grid.innerHTML = "";
  PROJECTS.filter(p => cat === "All" || p.category === cat).forEach(p => {
    const card = document.createElement("article");
    card.className = "card reveal";
    const thumb = document.createElement("div");
    if (p.images && p.images.length) {
      thumb.className = "thumb";
      const img = document.createElement("img");
      img.src = p.images[0];
      img.alt = p.title;
      img.loading = "lazy";
      thumb.appendChild(img);
      if (p.images.length > 1) {
        const c = document.createElement("span");
        c.className = "count";
        c.textContent = p.images.length + " images";
        thumb.appendChild(c);
      }
      thumb.addEventListener("click", () => openLb(p, 0));
    } else {
      thumb.className = "thumb empty";
      thumb.textContent = p.category;
    }
    const body = document.createElement("div");
    body.className = "card-body";
    body.innerHTML = `<span class="card-cat">${p.category}</span><h3>${p.title}</h3><p>${p.description || ""}</p>`;
    if (p.link) {
      const a = document.createElement("a");
      a.className = "card-link";
      a.href = p.link;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = p.linkText || "View project";
      body.appendChild(a);
    }
    card.append(thumb, body);
    grid.appendChild(card);
  });
  observe();
}

function openLb(p, i) {
  current = { images: p.images, index: i, title: p.title };
  showLb();
  lb.classList.add("open");
  lb.setAttribute("aria-hidden", "false");
}

function showLb() {
  lbImg.src = current.images[current.index];
  lbImg.alt = current.title;
  lbCap.textContent = current.title + "  " + (current.index + 1) + " / " + current.images.length;
  const multi = current.images.length > 1;
  document.getElementById("lbPrev").style.display = multi ? "" : "none";
  document.getElementById("lbNext").style.display = multi ? "" : "none";
}

function step(d) {
  current.index = (current.index + d + current.images.length) % current.images.length;
  showLb();
}

function closeLb() {
  lb.classList.remove("open");
  lb.setAttribute("aria-hidden", "true");
}

document.getElementById("lbClose").addEventListener("click", closeLb);
document.getElementById("lbPrev").addEventListener("click", () => step(-1));
document.getElementById("lbNext").addEventListener("click", () => step(1));
lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
document.addEventListener("keydown", e => {
  if (!lb.classList.contains("open")) return;
  if (e.key === "Escape") closeLb();
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
});

const io = new IntersectionObserver(entries => {
  entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
}, { threshold: 0.1 });

function observe() {
  document.querySelectorAll(".reveal:not(.in)").forEach(el => io.observe(el));
}

document.getElementById("year").textContent = new Date().getFullYear();
document.querySelectorAll(".service, .about-body, .contact h2").forEach(el => el.classList.add("reveal"));
renderFilters();
renderGrid("All");
