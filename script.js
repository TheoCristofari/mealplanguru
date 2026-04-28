const links = document.querySelectorAll("[data-view-link]");
const views = document.querySelectorAll("[data-view]");
const calendarGrid = document.querySelector("[data-calendar-grid]");
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
const resetPlannerButton = document.querySelector("[data-reset-planner]");
const resetModal = document.querySelector("[data-reset-modal]");
const cancelResetButton = document.querySelector("[data-cancel-reset]");
const confirmResetButton = document.querySelector("[data-confirm-reset]");
const updateShoppingButton = document.querySelector("[data-update-shopping]");
const shoppingList = document.querySelector("[data-shopping-list]");
const shoppingViewButtons = document.querySelectorAll("[data-shopping-view]");
const shoppingUpdatedModal = document.querySelector("[data-shopping-updated-modal]");
const closeShoppingUpdatedButton = document.querySelector("[data-close-shopping-updated]");
const exportRecipesButton = document.querySelector("[data-export-recipes]");
const importRecipesButton = document.querySelector("[data-import-recipes]");
const importRecipesFile = document.querySelector("[data-import-recipes-file]");
const labelInput = document.querySelector("[data-label-input]");
const labelOptions = document.querySelectorAll("[data-label-option]");
const recipeFilterButtons = document.querySelectorAll("[data-recipe-filter]");

const DEFAULT_RECIPES = [
  {
    id: "sheet-minestrone",
    name: "Minestrone",
    ingredients: "1 Onion\n1 Carrot\n1 Courgette\n1 Celery\n1 Can Mutti\n1 Canelini beans\nOrrechiete\nGrated Cheese",
    photoUrl: "images/minestrone.jpg",
  },
  {
    id: "sheet-sushi",
    name: "Sushi",
    ingredients: "1 Pack Nori\n1 Pack Sushi Rice\nRice Vinegar\nMayo\n1 Pack Smoked Tofu\n1 Avocat\n1 Cucumber\n1 Carrot\n1 Pepper",
    photoUrl: "images/sushi.jpg",
  },
  {
    id: "sheet-chili",
    name: "Chili",
    ingredients: "1 Onion\n1 Pepper\n2 garlic cloves\n1 Can Mutti\n1 Can Kidney Beans\n1 Can Corn",
    photoUrl: "images/chili.jpg",
  },
  {
    id: "sheet-burritos",
    name: "Burritos",
    ingredients: "1 Pack Wraps\nGrated Cheese\n1 Pack Potatoes\n1 Block Tofu\n1 Onion\n1 Thick Cream\n1 Pack Cherry Tomatoes\n1 Avocat\n2 Corn on the Cob",
    photoUrl: "images/burritos.jpg",
  },
  {
    id: "sheet-dan-dan-noodles",
    name: "Dan Dan noodles",
    ingredients: "150g dried wheat noodles\n100g vegan mince (soy or mushroom-based)\n1 tbsp soy sauce\n1 tbsp Chinese black vinegar\n1 tbsp tahini or Chinese sesame paste\n1 tsp chili oil\n1 garlic clove\n1 spring onion\n200ml veg stock\npak choi or tenderstem broccoli",
    photoUrl: "images/dan-dan-noodles.jpg",
  },
  {
    id: "sheet-quiche",
    name: "Quiche",
    ingredients: "Shortcrust Patry\nCream\nCornflour\nGood Tofu\nGrated Cheese\nSalad",
    photoUrl: "images/quiche.jpg",
  },
  {
    id: "sheet-shepherds-pie",
    name: "Shepherd's pie",
    ingredients: "1 tbsp olive oil\n1 small onion\n1 carrot\n1 celery stick\n100g mushrooms\n200g lentils (cooked or tinned)\n200ml veg stock\n1 tbsp tomato puree\n1/2 tsp thyme\n1/2 tsp rosemary\n400g potatoes\nsplash plant milk\n1 tbsp vegan butter",
    photoUrl: "images/shepherd-s-pie.jpg",
  },
  {
    id: "sheet-orzo-meatball-soup",
    name: "Orzo Meatball Soup",
    ingredients: "1 tbsp olive oil\n1 small onion\n1 garlic clove\n400g tin chopped tomatoes\n500ml veg stock\n60g orzo\n6-8 vegan meatballs\nhandful spinach\nsalt & pepper",
    photoUrl: "images/orzo-meatball-soup.jpg",
  },
  {
    id: "sheet-spaghetti-bolognese",
    name: "Spaghetti Bolognese",
    ingredients: "150g spaghetti\n1 tbsp olive oil\n1 onion\n1 carrot\n1 celery stick\n2 garlic cloves\n250g vegan mince or lentils\n400g tin chopped tomatoes\n1 tbsp tomato puree\n1 tsp oregano\n1/2 tsp thyme\nsalt & pepper",
    photoUrl: "images/spaghetti-bolognese.webp",
  },
  {
    id: "sheet-chickpea-curry",
    name: "Chickpea Curry",
    ingredients: "1 tbsp oil\n1 onion\n2 garlic cloves\n1 tsp grated ginger\n1 tbsp curry powder\n400g tin chopped tomatoes\n400g tin chickpeas\n100ml coconut milk\nhandful spinach\ncoriander (optional)\nsalt & pepper",
    photoUrl: "images/chickpea-curry.jpg",
  },
  {
    id: "sheet-dahl",
    name: "Dahl",
    ingredients: "1 tbsp oil\n1 onion\n2 garlic cloves\n1 tsp grated ginger\n1 tsp turmeric\n1 tsp cumin seeds\n150g red lentils\n500ml veg stock\n200ml coconut milk\ncoriander (optional)\nsalt",
    photoUrl: "images/dahl.jpg",
  },
  {
    id: "sheet-cassoulet",
    name: "Cassoulet",
    ingredients: "1 tbsp oil\n1 onion\n1 carrot\n1 celery stick\n2 garlic cloves\n400g tin chopped tomatoes\n400g tin cannellini beans\n400g tin butter beans\n200ml veg stock\n1 tsp thyme\n1 bay leaf\nsalt & pepper",
    photoUrl: "images/cassoulet.webp",
  },
  {
    id: "sheet-marry-me-lentils",
    name: "Marry Me Lentils",
    ingredients: "150g pasta (penne or rigatoni)\n1 tbsp oil\n2 garlic cloves\n100g red lentils\n200ml veg stock\n200ml coconut milk or oat cream\n1 tbsp tomato puree\n1 tsp paprika\n1/2 tsp chili flakes\nhandful spinach",
    photoUrl: "images/marry-me-lentils.webp",
  },
  {
    id: "sheet-risotto",
    name: "Risotto",
    ingredients: "1 tbsp oil\n1 onion\n1 garlic clove\n150g arborio rice\n500ml veg stock\n150g mushrooms\nsplash white wine (optional)\n2 tbsp nutritional yeast\n1 tbsp vegan butter\nparsley",
    photoUrl: "images/risotto.jpg",
  },
  {
    id: "sheet-rice-ratatouille",
    name: "Rice & Ratatouille",
    ingredients: "100g rice\n1 tbsp olive oil\n1 onion\n1 courgette\n1 aubergine\n1 red pepper\n2 garlic cloves\n400g tin chopped tomatoes\n1/2 tsp thyme\n1/2 tsp oregano\nsalt & pepper",
    photoUrl: "images/rice-ratatouille.jpg",
  },
  {
    id: "sheet-korma",
    name: "Korma",
    ingredients: "Riz\nCashews\nCoconut Milk\nOnion\nPois Chiches\nButter Beans\nConcentre de Tomate",
    photoUrl: "images/korma.jpg",
  },
  {
    id: "sheet-pitah-patate-salade",
    name: "Pitah & Patate Salade",
    ingredients: "Patates\nPitah Bread\nTomates Sechees\nOlives Noires (Denoyautees)\nFromage a tartiner",
    photoUrl: "images/pita.jpg",
  },
];

const DEFAULT_RECIPE_PHOTOS = DEFAULT_RECIPES.reduce((photos, recipe) => {
  photos[recipe.name.toLowerCase()] = recipe.photoUrl;
  return photos;
}, {});

let pendingDeleteCard = null;
let recipes = seedDefaultRecipes(loadRecipes());
let mealPlan = loadMealPlan();
let shoppingItems = loadShoppingList();
let shoppingRecipes = loadShoppingRecipes();
let shoppingView = "category";
let recipeFilter = "all";
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

function renderCalendar() {
  if (!calendarGrid) {
    return;
  }

  calendarGrid.innerHTML = "";

  for (let index = 0; index < 14; index += 1) {
    const dayKey = `slot-${index + 1}`;
    const day = document.createElement("div");
    day.className = "calendar-day";
    if (index % 7 >= 5) {
      day.classList.add("is-weekend");
    }

    const mealSlots = document.createElement("span");
    mealSlots.className = "meal-slots";

    ["Lunch", "Dinner"].forEach((mealName) => {
      const mealKey = mealName.toLowerCase();
      const assignmentKey = getMealPlanKey(dayKey, mealKey);
      const selectedRecipeName = mealPlan[assignmentKey];
      const mealSlot = document.createElement("span");
      mealSlot.className = "meal-slot";

      const mealLabel = document.createElement("span");
      mealLabel.className = "meal-label";
      mealLabel.textContent = mealName;

      const addMealButton = document.createElement("button");
      addMealButton.className = "add-meal-card";
      addMealButton.type = "button";
      addMealButton.setAttribute("aria-label", `Add ${mealName} recipe`);
      addMealButton.textContent = "+";
      addMealButton.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleMealDropdown(mealSlot, dayKey, mealKey);
      });

      mealSlot.append(mealLabel);

      if (selectedRecipeName) {
        const selectedRecipe = document.createElement("span");
        selectedRecipe.className = "planned-recipe";

        const selectedRecipeText = document.createElement("span");
        selectedRecipeText.className = "planned-recipe-name";
        selectedRecipeText.textContent = selectedRecipeName;

        const editMealButton = document.createElement("button");
        editMealButton.className = "edit-meal-button";
        editMealButton.type = "button";
        editMealButton.setAttribute("aria-label", `Change ${mealName} recipe`);
        editMealButton.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3Z" stroke-width="2" stroke-linejoin="round"></path>
            <path d="M14 7l3 3" stroke-width="2" stroke-linecap="round"></path>
          </svg>
        `;
        editMealButton.addEventListener("click", (event) => {
          event.stopPropagation();
          toggleMealDropdown(mealSlot, dayKey, mealKey);
        });

        const removeMealButton = document.createElement("button");
        removeMealButton.className = "remove-meal-button";
        removeMealButton.type = "button";
        removeMealButton.setAttribute("aria-label", `Remove ${mealName} recipe`);
        removeMealButton.innerHTML = `
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 6h18" stroke-width="2" stroke-linecap="round"></path>
            <path d="M8 6V4h8v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M6 6l1 15h10l1-15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M10 11v6M14 11v6" stroke-width="2" stroke-linecap="round"></path>
          </svg>
        `;
        removeMealButton.addEventListener("click", (event) => {
          event.stopPropagation();
          delete mealPlan[assignmentKey];
          saveMealPlan();
          renderCalendar();
        });

        selectedRecipe.append(selectedRecipeText, editMealButton, removeMealButton);
        mealSlot.append(selectedRecipe);
      } else {
        mealSlot.append(addMealButton);
      }
      mealSlots.append(mealSlot);
    });

    day.append(mealSlots);

    calendarGrid.append(day);
  }
}

links.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const selectedView = link.dataset.viewLink;
    showView(selectedView);
    history.pushState(null, "", `#${selectedView}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

function openRecipeModal(recipe = null) {
  editingRecipeId = recipe?.id || null;
  recipeForm.reset();
  setSelectedLabel(recipe?.label || "");

  if (recipe) {
    recipeForm.elements.recipeName.value = recipe.name;
    recipeForm.elements.ingredients.value = recipe.ingredients;
    recipeForm.elements.photoUrl.value = recipe.photoUrl ? recipe.photoUrl.replace(/^images\//, "") : "";
    recipeModalTitle.textContent = "Edit recipe";
    recipeSubmitButton.textContent = "Save";
  } else {
    recipeModalTitle.textContent = "Add recipe";
    recipeSubmitButton.textContent = "Add";
  }

  recipeModal.hidden = false;
  recipeModal.querySelector("input")?.focus();
}

function setSelectedLabel(label) {
  labelInput.value = label;
  const hasSelection = Boolean(label);
  document.querySelector(".label-options")?.classList.toggle("has-selection", hasSelection);

  labelOptions.forEach((option) => {
    const isSelected = option.dataset.labelOption === label;
    option.classList.toggle("is-selected", isSelected);
    option.setAttribute("aria-pressed", String(isSelected));
  });
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

function openResetModal() {
  resetModal.hidden = false;
  confirmResetButton?.focus();
}

function closeResetModal() {
  resetModal.hidden = true;
}

function openShoppingUpdatedModal() {
  shoppingUpdatedModal.hidden = false;
  closeShoppingUpdatedButton?.focus();
}

function closeShoppingUpdatedModal() {
  shoppingUpdatedModal.hidden = true;
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

async function exportRecipes() {
  const backup = {
    exportedAt: new Date().toISOString(),
    recipes,
  };
  const content = JSON.stringify(backup, null, 2);
  const todayLabel = new Date().toISOString().slice(0, 10);
  const suggestedName = `mealplanguru-recipes-${todayLabel}.json`;

  if (window.showSaveFilePicker) {
    const fileHandle = await window.showSaveFilePicker({
      suggestedName,
      types: [
        {
          description: "JSON file",
          accept: { "application/json": [".json"] },
        },
      ],
    });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
    return;
  }

  const blob = new Blob([content], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = suggestedName;
  link.click();
  URL.revokeObjectURL(url);
}

function importRecipesFromFile(file) {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    try {
      const parsed = JSON.parse(String(reader.result || "{}"));
      const importedRecipes = Array.isArray(parsed) ? parsed : parsed.recipes;

      if (!Array.isArray(importedRecipes)) {
        return;
      }

      const existingNames = new Set(recipes.map((recipe) => recipe.name.toLowerCase()));
      const recipesToAdd = importedRecipes
        .filter((recipe) => recipe.name && recipe.ingredients)
        .filter((recipe) => !existingNames.has(recipe.name.toLowerCase()))
        .map((recipe) => ({
          id: recipe.id || createRecipeId(),
          name: recipe.name,
          ingredients: recipe.ingredients,
          label: recipe.label || "",
          photoUrl: recipe.photoUrl || "",
        }));

      recipes = [...recipes, ...recipesToAdd];
      saveRecipes();
      renderRecipes();
      renderCalendar();
    } catch {
      // Keep the import quiet for now; invalid files simply do not change the page.
    }
  });
  reader.readAsText(file);
}

function seedDefaultRecipes(savedRecipes) {
  const seedKey = "mealPlanGuruDefaultRecipesSeeded";
  const recipesWithPhotos = savedRecipes.map((recipe) => ({
    ...recipe,
    photoUrl: recipe.photoUrl || DEFAULT_RECIPE_PHOTOS[recipe.name.toLowerCase()] || "",
  }));

  if (localStorage.getItem(seedKey) === "true") {
    localStorage.setItem("mealPlanGuruRecipes", JSON.stringify(recipesWithPhotos));
    return recipesWithPhotos;
  }

  const existingNames = new Set(recipesWithPhotos.map((recipe) => recipe.name.toLowerCase()));
  const recipesToAdd = DEFAULT_RECIPES.filter((recipe) => !existingNames.has(recipe.name.toLowerCase()));
  const nextRecipes = [...recipesWithPhotos, ...recipesToAdd];

  localStorage.setItem("mealPlanGuruRecipes", JSON.stringify(nextRecipes));
  localStorage.setItem(seedKey, "true");
  return nextRecipes;
}

function inferRecipeLabel(recipe) {
  const text = `${recipe.name} ${recipe.ingredients}`.toLowerCase();

  if (text.includes("quiche")) {
    return "quiche";
  }

  if (text.includes("soup")) {
    return "soup";
  }

  if (text.includes("noodle")) {
    return "noodles";
  }

  if (text.includes("pasta") || text.includes("spaghetti") || text.includes("orzo") || text.includes("penne") || text.includes("rigatoni")) {
    return "pasta";
  }

  if (text.includes("rice") || text.includes("riz") || text.includes("risotto")) {
    return "rice";
  }

  if (text.includes("potato") || text.includes("patate")) {
    return "potato";
  }

  return "";
}

function backfillRecipeLabels() {
  let changed = false;

  recipes = recipes.map((recipe) => {
    if (recipe.label === "noodle") {
      changed = true;
      return {
        ...recipe,
        label: "noodles",
      };
    }

    if (recipe.label !== undefined) {
      return recipe;
    }

    changed = true;
    return {
      ...recipe,
      label: inferRecipeLabel(recipe),
    };
  });

  if (changed) {
    saveRecipes();
  }
}

function loadMealPlan() {
  try {
    return JSON.parse(localStorage.getItem("mealPlanGuruMealPlan")) || {};
  } catch {
    return {};
  }
}

function saveMealPlan() {
  localStorage.setItem("mealPlanGuruMealPlan", JSON.stringify(mealPlan));
}

function loadShoppingList() {
  try {
    return JSON.parse(localStorage.getItem("mealPlanGuruShoppingList")) || [];
  } catch {
    return [];
  }
}

function saveShoppingList() {
  localStorage.setItem("mealPlanGuruShoppingList", JSON.stringify(shoppingItems));
}

function loadShoppingRecipes() {
  try {
    return JSON.parse(localStorage.getItem("mealPlanGuruShoppingRecipes")) || [];
  } catch {
    return [];
  }
}

function saveShoppingRecipes() {
  localStorage.setItem("mealPlanGuruShoppingRecipes", JSON.stringify(shoppingRecipes));
}

function getMealPlanKey(dateKey, mealKey) {
  return `${dateKey}:${mealKey}`;
}

function closeMealDropdowns() {
  document.querySelectorAll(".meal-dropdown").forEach((dropdown) => dropdown.remove());
}

function toggleMealDropdown(mealSlot, dateKey, mealKey) {
  const existingDropdown = mealSlot.querySelector(".meal-dropdown");
  closeMealDropdowns();

  if (existingDropdown) {
    return;
  }

  const dropdown = document.createElement("span");
  dropdown.className = "meal-dropdown";

  ["Leftovers", "Eating Out"].forEach((builtInOption) => {
    const builtInButton = document.createElement("button");
    builtInButton.className = "meal-dropdown-item meal-dropdown-built-in";
    builtInButton.type = "button";
    builtInButton.textContent = builtInOption;
    builtInButton.addEventListener("click", (event) => {
      event.stopPropagation();
      mealPlan[getMealPlanKey(dateKey, mealKey)] = builtInOption;
      saveMealPlan();
      renderCalendar();
    });
    dropdown.append(builtInButton);
  });

  if (recipes.length === 0) {
    const emptyItem = document.createElement("span");
    emptyItem.className = "meal-dropdown-empty";
    emptyItem.textContent = "No saved recipes yet";
    dropdown.append(emptyItem);
  } else {
    recipes.forEach((recipe) => {
      const recipeButton = document.createElement("button");
      recipeButton.className = "meal-dropdown-item";
      recipeButton.type = "button";
      recipeButton.textContent = recipe.name;
      recipeButton.addEventListener("click", (event) => {
        event.stopPropagation();
        mealPlan[getMealPlanKey(dateKey, mealKey)] = recipe.name;
        saveMealPlan();
        renderCalendar();
      });
      dropdown.append(recipeButton);
    });
  }

  mealSlot.append(dropdown);
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
    .map((ingredient) => ingredient.trim().replace(/^[•*-]\s*/, ""))
    .filter(Boolean);
}

function parseAmount(value) {
  if (!value) {
    return null;
  }

  const fractions = {
    "¼": 0.25,
    "½": 0.5,
    "¾": 0.75,
  };

  if (fractions[value]) {
    return fractions[value];
  }

  if (value.includes("/")) {
    const [top, bottom] = value.split("/").map(Number);
    return bottom ? top / bottom : null;
  }

  const number = Number(value);
  return Number.isNaN(number) ? null : number;
}

function singularize(item) {
  const trimmed = item.trim().toLowerCase();

  if (trimmed.endsWith("ies")) {
    return `${trimmed.slice(0, -3)}y`;
  }

  if (trimmed.endsWith("oes") || trimmed.endsWith("ches") || trimmed.endsWith("shes")) {
    return trimmed.slice(0, -2);
  }

  if (trimmed.endsWith("s") && !trimmed.endsWith("ss")) {
    return trimmed.slice(0, -1);
  }

  return trimmed;
}

function pluralize(item, amount) {
  if (amount === 1) {
    return item;
  }

  if (item.endsWith("y")) {
    return `${item.slice(0, -1)}ies`;
  }

  if (item.endsWith("o") || item.endsWith("ch") || item.endsWith("sh")) {
    return `${item}es`;
  }

  return `${item}s`;
}

function normalizeUnit(unit) {
  return singularize(unit);
}

function titleCase(text) {
  return text.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatAmount(amount) {
  if (amount === null) {
    return "";
  }

  return Number.isInteger(amount) ? String(amount) : String(Number(amount.toFixed(2)));
}

function parseIngredient(line) {
  const units = new Set([
    "g",
    "gram",
    "grams",
    "kg",
    "ml",
    "l",
    "tsp",
    "tbsp",
    "cup",
    "cups",
    "clove",
    "cloves",
    "can",
    "cans",
    "tin",
    "tins",
    "pack",
    "packs",
    "packet",
    "packets",
    "slice",
    "slices",
  ]);
  const match = line.trim().match(/^(\d+(?:\.\d+)?|\d+\/\d+|[¼½¾])?\s*(.*)$/);
  const amount = parseAmount(match?.[1]);
  const rest = (match?.[2] || line).trim();
  const parts = rest.split(/\s+/);
  const possibleUnit = parts[0]?.toLowerCase();
  const unit = amount !== null && units.has(possibleUnit) ? normalizeUnit(possibleUnit) : "";
  const itemText = unit ? parts.slice(1).join(" ") : rest;
  const item = singularize(itemText || line);

  return {
    amount,
    unit,
    item,
    original: line,
  };
}

function getIngredientCategory(item) {
  const categories = [
    ["Produce", ["onion", "garlic", "tomato", "potato", "carrot", "celery", "pepper", "lettuce", "spinach", "lemon", "lime", "apple", "banana", "mushroom", "herb", "parsley", "coriander", "basil", "avocado", "broccoli", "courgette", "zucchini"]],
    ["Meat & Fish", ["chicken", "beef", "pork", "lamb", "turkey", "sausage", "bacon", "fish", "salmon", "tuna", "prawn", "shrimp"]],
    ["Dairy & Eggs", ["milk", "cheese", "butter", "yogurt", "yoghurt", "cream", "egg", "parmesan", "mozzarella", "cheddar"]],
    ["Bakery", ["bread", "bagel", "wrap", "tortilla", "bun", "roll", "pitta", "pastry"]],
    ["Pantry", ["rice", "pasta", "flour", "sugar", "salt", "pepper", "oil", "vinegar", "stock", "bean", "lentil", "chickpea", "noodle", "sauce", "spice", "oregano", "paprika", "cumin"]],
    ["Frozen", ["frozen", "peas", "ice cream"]],
  ];

  const category = categories.find(([, keywords]) => keywords.some((keyword) => item.includes(keyword)));
  return category ? category[0] : "Other";
}

function formatShoppingItem(item) {
  const amount = formatAmount(item.amount);
  const name = item.unit ? item.item : pluralize(item.item, item.amount);

  if (!amount) {
    return titleCase(item.item);
  }

  if (item.unit) {
    return `${amount} ${pluralize(item.unit, item.amount)} ${name}`;
  }

  return `${amount} ${name}`;
}

function getPlannedRecipes() {
  const plannedRecipeNames = Object.values(mealPlan).filter((name) => name && name !== "Leftovers");
  return plannedRecipeNames
    .map((recipeName) => recipes.find((item) => item.name === recipeName))
    .filter(Boolean);
}

function buildShoppingList() {
  const plannedRecipeNames = Object.values(mealPlan).filter((name) => name && name !== "Leftovers");
  const ingredientMap = new Map();

  plannedRecipeNames.forEach((recipeName) => {
    const recipe = recipes.find((item) => item.name === recipeName);

    if (!recipe) {
      return;
    }

    getIngredientLines(recipe.ingredients).forEach((line) => {
      const parsed = parseIngredient(line);
      const key = `${parsed.unit}|${parsed.item}`;
      const current = ingredientMap.get(key);

      if (current) {
        current.amount =
          current.amount !== null && parsed.amount !== null ? current.amount + parsed.amount : null;
        return;
      }

      ingredientMap.set(key, {
        ...parsed,
        amount: parsed.amount === null ? null : parsed.amount,
        category: getIngredientCategory(parsed.item),
      });
    });
  });

  return Array.from(ingredientMap.values()).sort((a, b) => {
    if (a.category === b.category) {
      return a.item.localeCompare(b.item);
    }

    return a.category.localeCompare(b.category);
  });
}

function buildShoppingRecipes() {
  return getPlannedRecipes().map((recipe) => ({
    id: recipe.id,
    name: recipe.name,
    ingredients: getIngredientLines(recipe.ingredients).map(parseIngredient),
  }));
}

function renderShoppingList() {
  if (!shoppingList) {
    return;
  }

  shoppingList.innerHTML = "";

  if (shoppingView === "recipe") {
    renderShoppingByRecipe();
    return;
  }

  renderShoppingByCategory();
}

function renderShoppingByCategory() {
  if (shoppingItems.length === 0) {
    const empty = document.createElement("p");
    empty.className = "shopping-empty";
    empty.textContent = "Use Update Shopping from the Meal Planner to build your list.";
    shoppingList.append(empty);
    return;
  }

  const groupedItems = shoppingItems.reduce((groups, item) => {
    groups[item.category] ||= [];
    groups[item.category].push(item);
    return groups;
  }, {});

  Object.entries(groupedItems).forEach(([category, items]) => {
    const section = document.createElement("section");
    section.className = "shopping-category";

    const title = document.createElement("h2");
    title.textContent = category;

    const list = document.createElement("ul");
    items.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = formatShoppingItem(item);
      list.append(listItem);
    });

    section.append(title, list);
    shoppingList.append(section);
  });
}

function renderShoppingByRecipe() {
  if (shoppingRecipes.length === 0) {
    const empty = document.createElement("p");
    empty.className = "shopping-empty";
    empty.textContent = "Use Update Shopping from the Meal Planner to build your list.";
    shoppingList.append(empty);
    return;
  }

  shoppingRecipes.forEach((recipe) => {
    const section = document.createElement("section");
    section.className = "shopping-category";

    const title = document.createElement("h2");
    title.textContent = recipe.name;

    const list = document.createElement("ul");
    recipe.ingredients.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = formatShoppingItem(item);
      list.append(listItem);
    });

    section.append(title, list);
    shoppingList.append(section);
  });
}

function setShoppingView(view) {
  shoppingView = view === "recipe" ? "recipe" : "category";

  shoppingViewButtons.forEach((button) => {
    const isActive = button.dataset.shoppingView === shoppingView;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  renderShoppingList();
}

function normalizePhotoPath(value) {
  const path = value.trim();

  if (!path) {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return path.startsWith("images/") ? path : `images/${path}`;
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

  const content = document.createElement("div");
  content.className = "recipe-card-content";

  const textContent = document.createElement("div");
  textContent.className = "recipe-card-text";

  const actions = document.createElement("div");
  actions.className = "recipe-card-actions";

  const ingredientDetails = document.createElement("details");
  ingredientDetails.className = "recipe-ingredients";

  const ingredientSummary = document.createElement("summary");
  ingredientSummary.textContent = "See Ingredients";

  ingredientDetails.addEventListener("toggle", () => {
    ingredientSummary.textContent = ingredientDetails.open ? "Hide Ingredients" : "See Ingredients";
  });

  const ingredientList = document.createElement("ul");
  ingredientList.className = "recipe-ingredients-list";

  getIngredientLines(recipe.ingredients).forEach((ingredient) => {
    const item = document.createElement("li");
    item.textContent = ingredient;
    ingredientList.append(item);
  });

  if (recipe.photoUrl) {
    const photo = document.createElement("img");
    photo.className = "recipe-photo";
    photo.src = recipe.photoUrl;
    photo.alt = recipe.name;
    card.append(photo);
  }

  ingredientDetails.append(ingredientSummary, ingredientList);
  textContent.append(title, ingredientDetails);

  if (recipe.label) {
    const label = document.createElement("span");
    label.className = `recipe-label recipe-label-${recipe.label}`;
    label.textContent = recipe.label;
    textContent.append(label);
  }

  actions.append(deleteButton, editButton);
  content.append(textContent, actions);
  card.append(content);

  return card;
}

function renderRecipes() {
  if (!recipeGrid || !addRecipeButton) {
    return;
  }

  recipeGrid.querySelectorAll(".recipe-card-filled").forEach((card) => card.remove());
  recipes
    .filter((recipe) => recipeFilter === "all" || recipe.label === recipeFilter)
    .forEach((recipe) => {
    recipeGrid.insertBefore(createRecipeCard(recipe), addRecipeButton);
  });
}

function setRecipeFilter(filter) {
  recipeFilter = filter || "all";

  recipeFilterButtons.forEach((button) => {
    const isActive = button.dataset.recipeFilter === recipeFilter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  renderRecipes();
}

addRecipeButton?.addEventListener("click", () => openRecipeModal());
closeRecipeModalButton?.addEventListener("click", closeRecipeModal);
cancelDeleteButton?.addEventListener("click", closeDeleteModal);
resetPlannerButton?.addEventListener("click", openResetModal);
cancelResetButton?.addEventListener("click", closeResetModal);
updateShoppingButton?.addEventListener("click", () => {
  shoppingItems = buildShoppingList();
  shoppingRecipes = buildShoppingRecipes();
  saveShoppingList();
  saveShoppingRecipes();
  renderShoppingList();
  openShoppingUpdatedModal();
});
closeShoppingUpdatedButton?.addEventListener("click", closeShoppingUpdatedModal);
shoppingViewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setShoppingView(button.dataset.shoppingView);
  });
});
exportRecipesButton?.addEventListener("click", async () => {
  try {
    await exportRecipes();
  } catch {
    // Usually means the user cancelled the save dialog.
  }
});
importRecipesButton?.addEventListener("click", () => {
  importRecipesFile?.click();
});
importRecipesFile?.addEventListener("change", () => {
  const file = importRecipesFile.files?.[0];

  if (file) {
    importRecipesFromFile(file);
  }

  importRecipesFile.value = "";
});
labelOptions.forEach((option) => {
  option.addEventListener("click", () => {
    const selectedLabel = labelInput.value === option.dataset.labelOption ? "" : option.dataset.labelOption;
    setSelectedLabel(selectedLabel);
  });
});
recipeFilterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setRecipeFilter(button.dataset.recipeFilter);
  });
});
confirmDeleteButton?.addEventListener("click", () => {
  const recipeId = pendingDeleteCard?.dataset.recipeId;
  const recipeToDelete = recipes.find((recipe) => recipe.id === recipeId);
  recipes = recipes.filter((recipe) => recipe.id !== recipeId);
  if (recipeToDelete) {
    Object.keys(mealPlan).forEach((key) => {
      if (mealPlan[key] === recipeToDelete.name) {
        delete mealPlan[key];
      }
    });
    saveMealPlan();
    renderCalendar();
  }
  saveRecipes();
  pendingDeleteCard?.remove();
  closeDeleteModal();
});

confirmResetButton?.addEventListener("click", () => {
  mealPlan = {};
  shoppingItems = [];
  shoppingRecipes = [];
  saveMealPlan();
  saveShoppingList();
  saveShoppingRecipes();
  renderCalendar();
  renderShoppingList();
  closeResetModal();
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

resetModal?.addEventListener("click", (event) => {
  if (event.target === resetModal) {
    closeResetModal();
  }
});

shoppingUpdatedModal?.addEventListener("click", (event) => {
  if (event.target === shoppingUpdatedModal) {
    closeShoppingUpdatedModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && recipeModal && !recipeModal.hidden) {
    closeRecipeModal();
  }

  if (event.key === "Escape" && deleteModal && !deleteModal.hidden) {
    closeDeleteModal();
  }

  if (event.key === "Escape" && resetModal && !resetModal.hidden) {
    closeResetModal();
  }

  if (event.key === "Escape" && shoppingUpdatedModal && !shoppingUpdatedModal.hidden) {
    closeShoppingUpdatedModal();
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".meal-slot")) {
    closeMealDropdowns();
  }
});

recipeForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(recipeForm);
  const recipeName = String(formData.get("recipeName") || "").trim();
  const ingredients = String(formData.get("ingredients") || "").trim();
  const label = String(formData.get("label") || "");
  const photoPath = normalizePhotoPath(String(formData.get("photoUrl") || ""));

  if (!recipeName || !ingredients) {
    return;
  }

  if (editingRecipeId) {
    const oldRecipe = recipes.find((recipe) => recipe.id === editingRecipeId);
    recipes = recipes.map((recipe) => {
      if (recipe.id !== editingRecipeId) {
        return recipe;
      }

      return {
        ...recipe,
        name: recipeName,
        ingredients,
        label,
        photoUrl: photoPath || recipe.photoUrl,
      };
    });

    if (oldRecipe && oldRecipe.name !== recipeName) {
      Object.keys(mealPlan).forEach((key) => {
        if (mealPlan[key] === oldRecipe.name) {
          mealPlan[key] = recipeName;
        }
      });
      saveMealPlan();
    }
  } else {
    recipes.unshift({
      id: createRecipeId(),
      name: recipeName,
      ingredients,
      label,
      photoUrl: photoPath,
    });
  }

  saveRecipes();
  renderRecipes();
  renderCalendar();
  recipeForm.reset();
  closeRecipeModal();
});

showView(window.location.hash.replace("#", ""));
backfillRecipeLabels();
renderCalendar();
renderRecipes();
renderShoppingList();
