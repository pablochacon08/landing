"use strict";

// ============================================================
// CONFIGURACIÓN DE FIREBASE (Vía REST API para usar FETCH)
// ============================================================
// Al agregar .json al final, Firebase nos permite usar el fetch nativo.
const FIREBASE_URL = "https://devbridge-app-default-rtdb.firebaseio.com/postulaciones.json";

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
// 2. FETCH GET — Cargar aplicantes desde Firebase
// ============================================================
const loadApplicants = async () => {
  const container = document.getElementById("data-container");
  if (!container) return;

  const programaLabels = {
    cloud: "Cloud Computing Fundamentals",
    architect: "Experto Arquitectura Cloud",
  };

  try {
    // Uso de fetch - HTTP GET
    const response = await fetch(FIREBASE_URL);
    if (!response.ok) throw new Error("Error al leer la base de datos");
    
    const data = await response.json();
    let htmlContent = "";

    if (data && data !== null) {
      // Convertimos el objeto en array y lo invertimos (los más recientes primero)
      const usersArray = Object.values(data).reverse();

      usersArray.forEach((user) => {
        htmlContent += `
        <div class="applicant-card bg-white border border-line rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center gap-4 mb-4">
            <div class="avatar-circle w-12 h-12 rounded-full bg-brand flex items-center justify-center text-white font-bold text-lg shrink-0">
              ${user.nombre.charAt(0).toUpperCase()}
            </div>
            <div>
              <div class="text-[14px] font-bold text-navy">${user.nombre}</div>
              <div class="text-[12px] text-muted">${user.email}</div>
            </div>
          </div>
          <div class="text-[13px] text-muted">
            Programa: <span class="font-semibold text-navy">${programaLabels[user.programa] || user.programa}</span>
          </div>
        </div>
      `;
      });
      container.innerHTML = htmlContent;
    } else {
      container.innerHTML = `
        <div class="col-span-full text-center text-muted py-8 text-sm">
          Aún no hay postulantes. ¡Sé el primero en aplicar!
        </div>
      `;
    }
  } catch (error) {
    container.innerHTML = `
      <div class="col-span-full text-center text-red-500 py-8 text-sm">
        Error al conectar con la base de datos.
      </div>
    `;
    console.error("Error Fetch GET:", error);
  }
};

// ============================================================
// 3. FETCH POST — Enviar formulario a Firebase
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

    // Estado de carga visual en el botón
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin h-4 w-4 mr-2 inline" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      Enviando...
    `;

    const nuevaPostulacion = {
      nombre: nombre,
      email: email,
      programa: programa,
      fecha: new Date().toISOString()
    };

    try {
      // Uso de fetch - HTTP POST
      const response = await fetch(FIREBASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevaPostulacion)
      });

      if (!response.ok) throw new Error("Fallo al guardar en Firebase");

      // Mostrar confirmación visual de la tarjeta verde
      showConfirmation(nombre, email, programa);
      showAlert(alertBox, "¡Postulación enviada exitosamente!", "success");
      form.reset();

      // Al usar REST API, debemos volver a llamar al GET para actualizar la lista visualmente
      loadApplicants();

    } catch (error) {
      showAlert(alertBox, "Ocurrió un error. Intenta nuevamente.", "error");
      console.error("Error Fetch POST:", error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = "Enviar Postulación";
    }
  });
};

// ============================================================
// 4. SECCIÓN INTERACTIVA — Mostrar tarjeta verde de confirmación
// ============================================================
const showConfirmation = (nombre, email, programa) => {
  const programaLabels = {
    cloud: "Cloud Computing Fundamentals",
    architect: "Experto Arquitectura Cloud",
  };

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

  const form = document.getElementById("contact-form");
  if (form) form.after(card);
  card.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

// ============================================================
// 5. HELPERS — Alertas visuales
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