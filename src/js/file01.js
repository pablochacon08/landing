"use strict";

// ============================================================
// 1. INTERSECTION OBSERVER — Animaciones reveal al hacer scroll
// ============================================================
const initReveal = () => {
  const elements = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  elements.forEach((el) => observer.observe(el));
};

// ============================================================
// 2. FETCH GET — Cargar aplicantes desde JSONPlaceholder
// ============================================================
const loadApplicants = async () => {
  const container = document.getElementById("data-container");
  if (!container) return;

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");

    if (!response.ok) throw new Error("Error al cargar datos");

    const users = await response.json();
    const topUsers = users.slice(0, 3);

    container.innerHTML = topUsers
      .map(
        (user) => `
        <div class="applicant-card bg-white border border-line rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-4 mb-4">
            <div class="avatar-circle w-12 h-12 rounded-full bg-brand flex items-center justify-center text-white font-bold text-lg shrink-0">
              ${user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div class="text-[14px] font-bold text-navy">${user.name}</div>
              <div class="text-[12px] text-muted">@${user.username}</div>
            </div>
          </div>
          <div class="text-[13px] text-muted">
            Empresa: <span class="font-semibold text-navy">${user.company.name}</span>
          </div>
        </div>
      `
      )
      .join("");
  } catch (error) {
    container.innerHTML = `
      <div class="col-span-full text-center text-red-500 py-8 text-sm">
        Error al cargar los datos. Intenta nuevamente.
      </div>
    `;
    console.error("Error fetch GET:", error);
  }
};

// ============================================================
// 3. FETCH POST — Enviar formulario de postulación
// ============================================================
const handleFormSubmit = () => {
  const form = document.getElementById("contact-form");
  const submitBtn = document.getElementById("submit-btn");
  const alertBox = document.getElementById("form-alert");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const programa = document.getElementById("programa").value;

    // Validación básica
    if (!nombre || !email || !programa) {
      showAlert(alertBox, "Por favor completa todos los campos.", "error");
      return;
    }

    // Estado de carga
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      Enviando...
    `;

    try {
      // FETCH POST
      const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `Postulación de ${nombre}`,
          body: `Programa: ${programa} | Email: ${email}`,
          userId: 1,
        }),
      });

      if (!response.ok) throw new Error("Error en el servidor");

      const data = await response.json();
      console.log("Respuesta POST:", data);

      // Mostrar confirmación con los datos ingresados
      showConfirmation(nombre, email, programa);
      addApplicantToList(nombre, email, programa);
      showAlert(alertBox, "¡Postulación enviada exitosamente!", "success");
      form.reset();

    } catch (error) {
      showAlert(alertBox, "Ocurrió un error. Intenta nuevamente.", "error");
      console.error("Error fetch POST:", error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = "Enviar Postulación";
    }
  });
};

// ============================================================
// 4. SECCIÓN INTERACTIVA — Mostrar datos ingresados del formulario
// ============================================================
const showConfirmation = (nombre, email, programa) => {
  const programaLabels = {
    cloud: "Cloud Computing Fundamentals",
    architect: "Experto Arquitectura Cloud",
  };

  // Verificar si ya existe una tarjeta y removerla
  const existing = document.getElementById("confirmation-card");
  if (existing) existing.remove();

  const card = document.createElement("div");
  card.id = "confirmation-card";
  card.className = "confirmation-card mx-6 mb-4 p-4 rounded-xl border border-emerald-200 bg-emerald-50";
  card.innerHTML = `
    <div class="flex items-center gap-2 mb-3">
      <svg class="text-emerald-500 shrink-0" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span class="text-[13px] font-bold text-emerald-700">Postulación Registrada</span>
    </div>
    <div class="space-y-1.5">
      <div class="text-[12px] text-emerald-800">
        <span class="font-semibold">Nombre:</span> ${nombre}
      </div>
      <div class="text-[12px] text-emerald-800">
        <span class="font-semibold">Email:</span> ${email}
      </div>
      <div class="text-[12px] text-emerald-800">
        <span class="font-semibold">Programa:</span> ${programaLabels[programa] || programa}
      </div>
    </div>
  `;

  // Insertar la tarjeta después del formulario
  const form = document.getElementById("contact-form");
  if (form) form.after(card);

  // Scroll suave hacia la tarjeta
  card.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

const addApplicantToList = (nombre, email, programa) => {
  const container = document.getElementById("data-container");
  if (!container) return;

  const programaLabels = {
    cloud: "Cloud Computing Fundamentals",
    architect: "Experto Arquitectura Cloud",
  };

  const newCard = document.createElement("div");
  newCard.className =
    "applicant-card bg-white border border-line rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow";

  newCard.innerHTML = `
    <div class="flex items-center gap-4 mb-4">
      <div class="avatar-circle w-12 h-12 rounded-full bg-brand flex items-center justify-center text-white font-bold text-lg shrink-0">
        ${nombre.charAt(0).toUpperCase()}
      </div>
      <div>
        <div class="text-[14px] font-bold text-navy">${nombre}</div>
        <div class="text-[12px] text-muted">${email}</div>
      </div>
    </div>
    <div class="text-[13px] text-muted">
      Programa: <span class="font-semibold text-navy">${programaLabels[programa] || programa}</span>
    </div>
  `;

  container.prepend(newCard);
};

// ============================================================
// 5. HELPERS — Alert y utilidades
// ============================================================
const showAlert = (alertBox, message, type) => {
  if (!alertBox) return;

  alertBox.textContent = message;
  alertBox.className = `mb-4 p-3 rounded-md text-sm font-medium ${
    type === "success"
      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
      : "bg-red-50 text-red-700 border border-red-200"
  }`;
  alertBox.classList.remove("hidden");

  // Auto-ocultar después de 5 segundos
  setTimeout(() => {
    alertBox.classList.add("hidden");
  }, 5000);
};

// ============================================================
// 6. NAVBAR — Sombra al hacer scroll
// ============================================================
const initNavbar = () => {
  const nav = document.getElementById("nav");
  if (!nav) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      nav.classList.add("shadow-md");
    } else {
      nav.classList.remove("shadow-md");
    }
  });
};

// ============================================================
// INIT — Ejecutar todo al cargar el DOM
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  initReveal();
  loadApplicants();
  handleFormSubmit();
  initNavbar();
});