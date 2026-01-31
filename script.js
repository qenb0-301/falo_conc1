const WHATSAPP_PHONE = "7XXXXXXXXXX";
const BRAND_NAME = "[BRAND_NAME]";

const REGION = {
  name: "Краснодарский край",
};

const MODELS = [
  {
    name: "[MODEL_1_NAME]",
    features: ["Контролируемая активация", "Компактные компоненты", "Стабильная работа"],
  },
  {
    name: "[MODEL_2_NAME]",
    features: ["Гибкая конструкция", "Комфорт в повседневности", "Надёжные материалы"],
  },
  {
    name: "[MODEL_3_NAME]",
    features: ["Простое управление", "Быстрое привыкание", "Высокая предсказуемость"],
  },
];

const DOCTORS = [
  {
    id: 1,
    name: "Врач Петров А.А.",
    city: "Краснодар",
    experienceYears: 18,
    credentials: ["Уролог-андролог", "Опыт реконструктивной урологии", "Член профессиональных ассоциаций"],
    photo: "assets/doctor-placeholder.svg",
    whatsappPrefillDoctorTag: "Петров А.А.",
  },
  {
    id: 2,
    name: "Врач Соколова И.В.",
    city: "Сочи",
    experienceYears: 14,
    credentials: ["Уролог", "Хирургические методики", "Клинический стаж в ведущих центрах"],
    photo: "assets/doctor-placeholder.svg",
    whatsappPrefillDoctorTag: "Соколова И.В.",
  },
  {
    id: 3,
    name: "Врач Иванов М.С.",
    city: "Новороссийск",
    experienceYears: 21,
    credentials: ["Андролог", "Опыт имплантационной хирургии", "Системный подход к реабилитации"],
    photo: "assets/doctor-placeholder.svg",
    whatsappPrefillDoctorTag: "Иванов М.С.",
  },
  {
    id: 4,
    name: "Врач Лебедева Н.П.",
    city: "Армавир",
    experienceYears: 12,
    credentials: ["Уролог", "Консервативные и хирургические подходы", "Индивидуальное сопровождение"],
    photo: "assets/doctor-placeholder.svg",
    whatsappPrefillDoctorTag: "Лебедева Н.П.",
  },
  {
    id: 5,
    name: "Врач Смирнов Д.К.",
    city: "Геленджик",
    experienceYears: 16,
    credentials: ["Уролог-андролог", "Стажировки по стандартам США", "Научные публикации"],
    photo: "assets/doctor-placeholder.svg",
    whatsappPrefillDoctorTag: "Смирнов Д.К.",
  },
];

const buildWhatsAppLink = ({ city, doctorName }) => {
  const base = `https://wa.me/${WHATSAPP_PHONE}`;
  const resolvedCity = city || "[ваш город]";
  const messageLines = [
    "Здравствуйте. Хочу узнать о фаллопротезировании.",
    "Прошу сохранить конфиденциальность.",
    `Город: ${resolvedCity}.`,
  ];

  if (doctorName) {
    messageLines.push(`Интересует врач: ${doctorName}.`);
  }

  const message = encodeURIComponent(messageLines.join(" "));
  return `${base}?text=${message}`;
};

const updateWhatsAppLinks = () => {
  const elements = [
    "header-whatsapp",
    "hero-whatsapp",
    "contact-whatsapp",
    "footer-whatsapp",
    "fab-whatsapp",
  ];

  elements.forEach((id) => {
    const element = document.getElementById(id);
    if (element) {
      element.href = buildWhatsAppLink({ city: "" });
      element.target = "_blank";
      element.rel = "noopener noreferrer";
    }
  });
};

const renderModels = () => {
  const modelsContainer = document.getElementById("models");
  const brandName = document.getElementById("brand-name");

  if (!modelsContainer || !brandName) return;

  brandName.textContent = BRAND_NAME;
  modelsContainer.innerHTML = MODELS.map(
    (model) => `
      <article class="card">
        <h3>${model.name}</h3>
        <ul>
          ${model.features.map((feature) => `<li>${feature}</li>`).join("")}
        </ul>
      </article>
    `
  ).join("");
};

const renderDoctors = (cityFilter = "all") => {
  const doctorsGrid = document.getElementById("doctors-grid");
  if (!doctorsGrid) return;

  const filtered = cityFilter === "all" ? DOCTORS : DOCTORS.filter((doctor) => doctor.city === cityFilter);

  doctorsGrid.innerHTML = filtered
    .map(
      (doctor) => `
      <article class="card doctor-card reveal">
        <img src="${doctor.photo}" alt="${doctor.name}" loading="lazy" />
        <h3>${doctor.name}</h3>
        <p class="muted">${doctor.city} · Стаж ${doctor.experienceYears} лет</p>
        <ul>
          ${doctor.credentials.map((item) => `<li>${item}</li>`).join("")}
        </ul>
        <a class="btn btn-secondary" href="${buildWhatsAppLink({
          city: doctor.city,
          doctorName: doctor.whatsappPrefillDoctorTag,
        })}" target="_blank" rel="noopener noreferrer">
          Написать анонимно по поводу операции
        </a>
        <p class="tag">Уточняется индивидуально, возможные форматы обсуждаются заранее.</p>
      </article>
    `
    )
    .join("");
};

const populateCityFilter = () => {
  const filter = document.getElementById("city-filter");
  if (!filter) return;

  const cities = [...new Set(DOCTORS.map((doctor) => doctor.city))];

  cities.forEach((city) => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    filter.appendChild(option);
  });

  filter.addEventListener("change", (event) => {
    renderDoctors(event.target.value);
    observeReveal();
  });
};

const setupAccordion = () => {
  const triggers = document.querySelectorAll(".accordion-trigger");
  triggers.forEach((trigger) => {
    const panel = trigger.nextElementSibling;
    trigger.addEventListener("click", () => {
      const expanded = trigger.getAttribute("aria-expanded") === "true";
      triggers.forEach((item) => {
        item.setAttribute("aria-expanded", "false");
        const sibling = item.nextElementSibling;
        if (sibling) sibling.classList.remove("open");
      });
      trigger.setAttribute("aria-expanded", String(!expanded));
      if (panel) panel.classList.toggle("open", !expanded);
    });
  });
};

const observeReveal = () => {
  const items = document.querySelectorAll(".section, .card, .timeline-item");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => {
    item.classList.add("reveal");
    observer.observe(item);
  });
};

const setYear = () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
};

document.addEventListener("DOMContentLoaded", () => {
  updateWhatsAppLinks();
  renderModels();
  renderDoctors();
  populateCityFilter();
  setupAccordion();
  observeReveal();
  setYear();
});
