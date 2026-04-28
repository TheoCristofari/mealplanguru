const links = document.querySelectorAll("[data-view-link]");
const views = document.querySelectorAll("[data-view]");
const calendarGrid = document.querySelector("[data-calendar-grid]");
const calendarTitle = document.querySelector("#calendar-title");
const previousMonthButton = document.querySelector("[data-calendar-prev]");
const nextMonthButton = document.querySelector("[data-calendar-next]");
const addRecipeButton = document.querySelector(".add-recipe-card");
const recipeGrid = document.querySelector(".recipe-grid");
const recipeModal = document.querySelector("[data-recipe-modal]");
const closeRecipeModalButton = document.querySelector("[data-close-recipe-modal]");
const recipeForm = document.querySelector("[data-recipe-form]");
const recipeModalTitle = document.querySelector("[data-recipe-modal-title]");
const recipeSubmitButton = document.querySelector("[data-recipe-submit]");
const deleteModal = document.querySelector("[data-delete-modal]");
const cancelDeleteButton = document.querySelector("[data-cancel-delete]");
const confirmDeleteButton = document.querySelector("[data-confirm-delete]");

const today = new Date();
let visibleDate = getMondayStart(today);
let selectedDateKey = formatDateKey(today);
let pendingDeleteCard = null;
let recipes = loadRecipes();
let editingRecipeId = null;

function showView(viewName) {
  const availableViews = ["calendar", "recipes", "shopping"];
  const selectedView = availableViews.includes(viewName) ? viewName : "calendar";

  views.forEach((view) => {
    const isActive = view.dataset.view === selectedView;
    view.hidden = !isActive;
    view.classList.toggle("active-view", isActive);
  });

  links.forEach((link) => {
    const isActive = link.dataset.viewLink === selectedView;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function formatDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getMondayStart(date) {
  const start = new Date(date);
  const day = start.getDay();
  const offset = day === 0 ? -6 : 1 - day;
  start.setDate(start.getDate() + offset);
  start.setHours(0, 0, 0, 0);
  return start;
}

function renderCalendar() {
  if (!calendarGrid || !calendarTitle) {
    return;
  }

  const endDate = new Date(visibleDate);
  endDate.setDate(visibleDate.getDate() + 13);
  const startLabel = visibleDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
  const endLabel = endDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const startDate = new Date(visibleDate);

  calendarTitle.textContent = `${startLabel} - ${endLabel}`;
  calendarGrid.innerHTML = "";

  for (let index = 0; index < 14; index += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    const dateKey = formatDateKey(date);
    const day = document.createElement("button");
    day.className = "calendar-day";
    day.type = "button";
    day.setAttribute("aria-label", date.toLocaleDateString("en-GB", { dateStyle: "full" }));

    if (dateKey === formatDateKey(today)) {
      day.classList.add("is-today");
    }

    if (dateKey === selectedDateKey) {
      day.classList.add("is-selected");
    }

    const dateNumber = document.createElement("span");
    dateNumber.className = "date-number";
    dateNumber.textContent = date.getDate();
    day.append(dateNumber);

    const mealSlots = document.createElement("span");
    mealSlots.className = "meal-slots";

    ["Lunch", "Dinner"].forEach((mealName) => {
      const mealSlot = document.createElement("span");
      mealSlot.className = "meal-slot";

      const mealLabel = document.createElement("span");
      mealLabel.className = "meal-label";
      mealLabel.textContent = mealName;

      const addMealButton = document.createElement("span");
      addMealButton.className = "add-meal-card";
      addMealButton.textContent = "Add card";

      mealSlot.append(mealLabel, addMealButton);
      mealSlots.append(mealSlot);
    });

    day.append(mealSlots);

    day.addEventListener("click", () => {
      selectedDateKey = dateKey;
      renderCalendar();
    });

    calendarGrid.append(day);
  }
}

links.forEach((link) => {
  link.addEventListener("click", () => {
    showView(link.dataset.viewLink);
  });
});

previousMonthButton?.addEventListener("click", () => {
  visibleDate.setDate(visibleDate.getDate() - 14);
  renderCalendar();
});

nextMonthButton?.addEventListener("click", () => {
  visibleDate.setDate(visibleDate.getDate() + 14);
  renderCalendar();
});

function openRecipeModal(recipe = null) {
  editingRecipeId = recipe?.id || null;
  recipeForm.reset();

  if (recipe) {
    recipeForm.elements.recipeName.value = recipe.name;
    recipeForm.elements.ingredients.value = recipe.ingredients;
    recipeModalTitle.textContent = "Edit recipe";
    recipeSubmitButton.textContent = "Save";
  } else {
    recipeModalTitle.textContent = "Add recipe";
    recipeSubmitButton.textContent = "Add";
  }

  recipeModal.hidden = false;
  recipeModal.querySelector("input")?.focus();
}

function closeRecipeModal() {
  editingRecipeId = null;
  recipeModal.hidden = true;
}

function openDeleteModal(card) {
  pendingDeleteCard = card;
  deleteModal.hidden = false;
  confirmDeleteButton?.focus();
}

function closeDeleteModal() {
  pendingDeleteCard = null;
  deleteModal.hidden = true;
}

function loadRecipes() {
  try {
    return JSON.parse(localStorage.getItem("mealPlanGuruRecipes")) || [];
  } catch {
    return [];
  }
}

function saveRecipes() {
  localStorage.setItem("mealPlanGuruRecipes", JSON.stringify(recipes));
}

function createRecipeId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `recipe-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getIngredientLines(ingredients) {
  return ingredients
    .split("\n")
    .map((ingredient) => ingredient.trim())
    .filter(Boolean);
}

function readPhoto(file) {
  return new Promise((resolve) => {
    if (!file || file.size === 0) {
      resolve("");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.readAsDataURL(file);
  });
}

function createRecipeCard(recipe) {
  const card = document.createElement("article");
  card.className = "recipe-card recipe-card-filled";
  card.dataset.recipeId = recipe.id;

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-card-button";
  deleteButton.type = "button";
  deleteButton.setAttribute("aria-label", `Remove ${recipe.name}`);
  deleteButton.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 6h18" stroke-width="2" stroke-linecap="round"></path>
      <path d="M8 6V4h8v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="M6 6l1 15h10l1-15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
      <path d="M10 11v6M14 11v6" stroke-width="2" stroke-linecap="round"></path>
    </svg>
  `;
  deleteButton.addEventListener("click", () => openDeleteModal(card));

  const editButton = document.createElement("button");
  editButton.className = "edit-card-button";
  editButton.type = "button";
  editButton.setAttribute("aria-label", `Edit ${recipe.name}`);
  editButton.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z" stroke-width="2" stroke-linejoin="round"></path>
      <path d="M14 7l3 3" stroke-width="2" stroke-linecap="round"></path>
    </svg>
  `;
  editButton.addEventListener("click", () => openRecipeModal(recipe));

  const title = document.createElement("h2");
  title.className = "recipe-card-title";
  title.textContent = recipe.name;

  const ingredientDetails = document.createElement("details");
  ingredientDetails.className = "recipe-ingredients";

  const ingredientSummary = document.createElement("summary");
  ingredientSummary.textContent = "Ingredients";

  const ingredientList = document.createElement("ul");
  ingredientList.className = "recipe-ingredients-list";

  getIngredientLines(recipe.ingredients).forEach((ingredient) => {
    const item = document.createElement("li");
    item.textContent = ingredient;
    ingredientList.append(item);
  });

  ingredientDetails.append(ingredientSummary, ingredientList);
  card.append(deleteButton, editButton, title, ingredientDetails);

  if (recipe.photoUrl && recipe.photoUrl.startsWith("data:image/")) {
    const photo = document.createElement("img");
    photo.className = "recipe-photo";
    photo.src = recipe.photoUrl;
    photo.alt = recipe.name;
    card.append(photo);
  }

  return card;
}

function renderRecipes() {
  if (!recipeGrid || !addRecipeButton) {
    return;
  }

  const firstEmptyCard = recipeGrid.querySelector(".recipe-card:not(.recipe-card-filled)");
  recipeGrid.querySelectorAll(".recipe-card-filled").forEach((card) => card.remove());
  recipes.forEach((recipe) => {
    recipeGrid.insertBefore(createRecipeCard(recipe), firstEmptyCard);
  });
}

addRecipeButton?.addEventListener("click", () => openRecipeModal());
closeRecipeModalButton?.addEventListener("click", closeRecipeModal);
cancelDeleteButton?.addEventListener("click", closeDeleteModal);
confirmDeleteButton?.addEventListener("click", () => {
  const recipeId = pendingDeleteCard?.dataset.recipeId;
  recipes = recipes.filter((recipe) => recipe.id !== recipeId);
  saveRecipes();
  pendingDeleteCard?.remove();
  closeDeleteModal();
});

recipeModal?.addEventListener("click", (event) => {
  if (event.target === recipeModal) {
    closeRecipeModal();
  }
});

deleteModal?.addEventListener("click", (event) => {
  if (event.target === deleteModal) {
    closeDeleteModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && recipeModal && !recipeModal.hidden) {
    closeRecipeModal();
  }

  if (event.key === "Escape" && deleteModal && !deleteModal.hidden) {
    closeDeleteModal();
  }
});

recipeForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(recipeForm);
  const recipeName = String(formData.get("recipeName") || "").trim();
  const ingredients = String(formData.get("ingredients") || "").trim();
  const photoFile = formData.get("photo");

  if (!recipeName || !ingredients) {
    return;
  }

  const hasNewPhoto = photoFile instanceof File && photoFile.size > 0;
  const photoUrl = await readPhoto(hasNewPhoto ? photoFile : null);

  if (editingRecipeId) {
    recipes = recipes.map((recipe) => {
      if (recipe.id !== editingRecipeId) {
        return recipe;
      }

      return {
        ...recipe,
        name: recipeName,
        ingredients,
        photoUrl: hasNewPhoto ? photoUrl : recipe.photoUrl,
      };
    });
  } else {
    recipes.unshift({
      id: createRecipeId(),
      name: recipeName,
      ingredients,
      photoUrl,
    });
  }

  saveRecipes();
  renderRecipes();
  recipeForm.reset();
  closeRecipeModal();
});

showView(window.location.hash.replace("#", ""));
renderCalendar();
renderRecipes();
