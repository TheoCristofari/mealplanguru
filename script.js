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
const manualShoppingList = document.querySelector("[data-manual-shopping-list]");
const manualShoppingForm = document.querySelector("[data-manual-shopping-form]");
const shoppingUpdatedModal = document.querySelector("[data-shopping-updated-modal]");
const closeShoppingUpdatedButton = document.querySelector("[data-close-shopping-updated]");
const adminRequiredModal = document.querySelector("[data-admin-required-modal]");
const closeAdminRequiredButton = document.querySelector("[data-close-admin-required]");
const labelInput = document.querySelector("[data-label-input]");
const labelOptions = document.querySelectorAll("[data-label-option]");
const recipeFilterButtons = document.querySelectorAll("[data-recipe-filter]");
const passwordScreen = document.querySelector("[data-password-screen]");
const passwordForm = document.querySelector("[data-password-form]");
const passwordInput = document.querySelector("[data-password-input]");
const passwordError = document.querySelector("[data-password-error]");
const lockSiteButton = document.querySelector("[data-lock-site]");
const authButton = document.querySelector("[data-auth-button]");
const authModal = document.querySelector("[data-auth-modal]");
const authForm = document.querySelector("[data-auth-form]");
const authTitle = document.querySelector("[data-auth-title]");
const authMessage = document.querySelector("[data-auth-message]");
const adminChoiceButton = document.querySelector("[data-admin-choice]");
const closeAuthButton = document.querySelector("[data-close-auth]");
const SITE_PASSWORD = "guru";
const SITE_UNLOCK_KEY = "mealPlanGuruUnlocked";
const RECIPE_DATA_URL = "recipes.json";
const SUPABASE_URL = "https://beguxpppyngjphetlviv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_r_My8zwj297QswRnj9Dvmw_6vMeJBhj";
const SUPABASE_RECIPE_TABLE = "recipes";
const SUPABASE_EXTRAS_TABLE = "shopping_extras";
const SUPABASE_IMAGE_BUCKET = "recipe-images";
const ADMIN_EMAIL = "theo@companydebt.com";
const ADMIN_DISPLAY_NAME = "Théo";
const ADMIN_REDIRECT_URL = "https://theocristofari.github.io/mealplanguru/";
const ADMIN_LOGIN_ICON = `
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M20 21a8 8 0 0 0-16 0" stroke-width="2" stroke-linecap="round"></path>
    <circle cx="12" cy="7" r="4" stroke-width="2"></circle>
  </svg>
`;
const ADMIN_SIGN_OUT_ICON = `
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M16 17l5-5-5-5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M21 12H9" stroke-width="2" stroke-linecap="round"></path>
  </svg>
`;
const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) || null;
const RECIPE_LABEL_ORDER = ["pasta", "rice", "potato", "noodles", "soup", "quiche", ""];
const DEFAULT_INGREDIENT_PREVIEW_LIMIT = 4;
const COMPACT_INGREDIENT_PREVIEW_LIMIT = 3;
const RECIPE_LABEL_NAMES = {
  pasta: "Pasta",
  rice: "Rice",
  potato: "Potato",
  noodles: "Noodles",
  soup: "Soup",
  quiche: "Quiche",
  "": "Other",
};
const MEAL_DROPDOWN_COLUMNS = [
  ["built-ins", "pasta", "noodles", ""],
  ["rice", "soup"],
  ["potato", "quiche"],
];


let pendingDeleteCard = null;
let recipes = [];
let mealPlan = loadMealPlan();
let shoppingItems = loadShoppingList();
let shoppingRecipes = loadShoppingRecipes();
let manualShoppingItems = loadManualShoppingList();
let checkedShoppingItems = loadCheckedShoppingItems();
let shoppingView = "category";
let recipeFilter = "all";
let editingRecipeId = null;
let currentUser = null;
let isAdmin = false;
let authLinkSent = false;

function unlockSite() {
  localStorage.setItem(SITE_UNLOCK_KEY, "true");
  document.body.classList.remove("locked");
  passwordError.hidden = true;
}

function lockSite() {
  localStorage.removeItem(SITE_UNLOCK_KEY);
  document.body.classList.add("locked");
  passwordForm?.reset();
  passwordInput?.focus();
}

function initializePasswordGate() {
  const isUnlocked = localStorage.getItem(SITE_UNLOCK_KEY) === "true";

  if (isUnlocked) {
    unlockSite();
    return;
  }

  document.body.classList.add("locked");
  passwordInput?.focus();
}

function updateAdminState(user) {
  currentUser = user || null;
  isAdmin = currentUser?.email?.toLowerCase() === ADMIN_EMAIL;
  document.body.classList.toggle("is-admin", isAdmin);

  if (authButton) {
    authButton.setAttribute("aria-pressed", String(isAdmin));
    authButton.setAttribute("aria-label", isAdmin ? "Sign out" : "Admin login");
    authButton.setAttribute("title", isAdmin ? "Sign out" : "Admin login");
    authButton.innerHTML = isAdmin ? ADMIN_SIGN_OUT_ICON : ADMIN_LOGIN_ICON;
  }

  if (addRecipeButton) {
    addRecipeButton.hidden = !isAdmin;
  }

  renderRecipes();
}

async function initializeAuth() {
  if (!supabaseClient) {
    return;
  }

  const { data } = await supabaseClient.auth.getSession();
  updateAdminState(data.session?.user || null);
  supabaseClient.auth.onAuthStateChange((event, session) => {
    updateAdminState(session?.user || null);
  });
}

function openAuthModal() {
  if (!authModal || !authMessage) {
    return;
  }

  authLinkSent = false;
  if (authTitle) {
    authTitle.textContent = "Who's There?";
  }
  authMessage.textContent = "Select a user";
  if (adminChoiceButton) {
    adminChoiceButton.textContent = ADMIN_DISPLAY_NAME;
    adminChoiceButton.classList.remove("is-confirmation");
  }
  authModal.hidden = false;
  adminChoiceButton?.focus();
}

function closeAuthModal() {
  if (!authModal) {
    return;
  }

  authModal.hidden = true;
}

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

  if (selectedView === "recipes") {
    scheduleRecipePreviewRefresh();
  }
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
      addMealButton.innerHTML = `
        <span class="add-meal-plus" aria-hidden="true">+</span>
        <span class="add-meal-text">Add meal</span>
      `;
      addMealButton.addEventListener("click", (event) => {
        event.stopPropagation();
        toggleMealDropdown(mealSlot, dayKey, mealKey);
      });

      mealSlot.append(mealLabel);

      if (selectedRecipeName) {
        const selectedRecipe = document.createElement("span");
        selectedRecipe.className = "planned-recipe";
        const plannedRecipe = recipes.find((recipe) => recipe.name === selectedRecipeName);
        const plannedLabel = plannedRecipe?.label;
        if (plannedLabel) {
          selectedRecipe.classList.add(`planned-recipe-${plannedLabel}`);
        } else if (selectedRecipeName === "Leftovers" || selectedRecipeName === "Eating Out") {
          selectedRecipe.classList.add("planned-recipe-built-in");
        }

        const selectedRecipeText = document.createElement("span");
        selectedRecipeText.className = "planned-recipe-name";
        selectedRecipeText.textContent = selectedRecipeName;
        selectedRecipe.addEventListener("click", (event) => {
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
          renderRecipes();
        });

        selectedRecipe.append(selectedRecipeText, removeMealButton);
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

function openAdminRequiredModal() {
  adminRequiredModal.hidden = false;
  closeAdminRequiredButton?.focus();
}

function closeAdminRequiredModal() {
  adminRequiredModal.hidden = true;
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

function recipeToSupabaseRow(recipe, index = 0) {
  return {
    id: recipe.id,
    name: recipe.name,
    ingredients: recipe.ingredients,
    label: recipe.label || "",
    photo_url: recipe.photoUrl || "",
    sort_order: index,
  };
}

function recipeFromSupabaseRow(row) {
  return normalizeRecipeRecord({
    id: row.id,
    name: row.name,
    ingredients: row.ingredients,
    label: row.label || "",
    photoUrl: row.photo_url || "",
  });
}

async function loadSupabaseRecipes() {
  if (!supabaseClient) {
    return [];
  }

  const { data, error } = await supabaseClient
    .from(SUPABASE_RECIPE_TABLE)
    .select("id,name,ingredients,label,photo_url,sort_order")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error || !Array.isArray(data)) {
    return [];
  }

  return data.map(recipeFromSupabaseRow).filter(Boolean);
}

async function saveRecipeToSupabase(recipe, sortIndex = 0) {
  if (!supabaseClient || !isAdmin) {
    throw new Error("You need to be logged in as admin to save recipes.");
  }

  const { error } = await supabaseClient
    .from(SUPABASE_RECIPE_TABLE)
    .upsert(recipeToSupabaseRow(recipe, sortIndex));

  if (error) {
    throw error;
  }
}

async function deleteRecipeFromSupabase(recipeId) {
  if (!supabaseClient || !recipeId || !isAdmin) {
    throw new Error("You need to be logged in as admin to delete recipes.");
  }

  const { error } = await supabaseClient.from(SUPABASE_RECIPE_TABLE).delete().eq("id", recipeId);

  if (error) {
    throw error;
  }
}

async function syncRecipesToSupabase() {
  if (!supabaseClient || !isAdmin || recipes.length === 0) {
    return;
  }

  await supabaseClient
    .from(SUPABASE_RECIPE_TABLE)
    .upsert(recipes.map(recipeToSupabaseRow));
}

async function loadRecipeFile() {
  try {
    const response = await fetch(RECIPE_DATA_URL, { cache: "no-store" });

    if (!response.ok) {
      return [];
    }

    const parsed = await response.json();
    const recipeData = Array.isArray(parsed) ? parsed : parsed.recipes;
    return Array.isArray(recipeData) ? recipeData.map(normalizeRecipeRecord).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function normalizeRecipeRecord(recipe) {
  if (!recipe || !recipe.name || !recipe.ingredients) {
    return null;
  }

  const cleanIngredients = cleanRecipeIngredients(recipe.ingredients);
  return {
    id: recipe.id || createRecipeId(),
    name: String(recipe.name).trim(),
    ingredients: cleanIngredients,
    label: recipe.label === "noodle" ? "noodles" : recipe.label || inferRecipeLabel({ ...recipe, ingredients: cleanIngredients }),
    photoUrl: recipe.photoUrl || "",
  };
}

function slugifyFilename(value) {
  return String(value || "recipe")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "recipe";
}

async function uploadRecipePhoto(file, recipe) {
  if (!supabaseClient || !isAdmin || !file || file.size === 0) {
    return "";
  }

  const extension = file.name.includes(".") ? file.name.split(".").pop().toLowerCase() : "jpg";
  const safeName = slugifyFilename(recipe.name);
  const path = `${recipe.id}/${safeName}-${Date.now()}.${extension}`;
  const { error } = await supabaseClient.storage
    .from(SUPABASE_IMAGE_BUCKET)
    .upload(path, file, {
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data } = supabaseClient.storage.from(SUPABASE_IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

function getRecipeKey(recipe) {
  return recipe.id || recipe.name.toLowerCase();
}

function getRecipeNameKey(recipe) {
  return recipe.name.toLowerCase();
}

function mergeRecipeData(fileRecipes, savedRecipes) {
  const fileById = new Map(fileRecipes.map((recipe) => [getRecipeKey(recipe), recipe]));
  const fileByName = new Map(fileRecipes.map((recipe) => [getRecipeNameKey(recipe), recipe]));
  const savedRecipeData = savedRecipes.map((recipe) => {
    const baseRecipe = fileById.get(getRecipeKey(recipe)) || fileByName.get(getRecipeNameKey(recipe)) || {};
    return normalizeRecipeRecord({
      ...baseRecipe,
      ...recipe,
      ingredients: recipe.ingredients || baseRecipe.ingredients,
      label: recipe.label || baseRecipe.label,
      photoUrl: recipe.photoUrl || baseRecipe.photoUrl,
    });
  }).filter(Boolean);

  if (!savedRecipeData.length) {
    return fileRecipes;
  }

  const savedIds = new Set(savedRecipeData.map(getRecipeKey));
  const savedNames = new Set(savedRecipeData.map(getRecipeNameKey));
  const newFileRecipes = fileRecipes.filter((recipe) => !savedIds.has(getRecipeKey(recipe)) && !savedNames.has(getRecipeNameKey(recipe)));
  return [...savedRecipeData, ...newFileRecipes];
}

async function loadInitialRecipes() {
  const supabaseRecipes = await loadSupabaseRecipes();
  const fileRecipes = await loadRecipeFile();
  const cachedRecipes = loadRecipes();
  const baselineRecipes = supabaseRecipes.length > 0 ? supabaseRecipes : fileRecipes;
  recipes = baselineRecipes.length > 0 ? baselineRecipes : cachedRecipes;
  saveRecipes();
  backfillRecipeLabels();

  if (supabaseRecipes.length === 0 && recipes.length > 0) {
    syncRecipesToSupabase();
  }
}

function cleanRecipeIngredients(ingredients) {
  return String(ingredients || "")
    .split("\n")
    .map((ingredient) => ingredient.trim())
    .filter(Boolean)
    .join("\n");
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
    const cleanIngredients = cleanRecipeIngredients(recipe.ingredients);

    if (recipe.label === "noodle") {
      changed = true;
      return {
        ...recipe,
        ingredients: cleanIngredients,
        label: "noodles",
      };
    }

    if (recipe.label !== undefined && recipe.ingredients === cleanIngredients) {
      return recipe;
    }

    changed = true;
    return {
      ...recipe,
      ingredients: cleanIngredients,
      label: recipe.label || inferRecipeLabel({ ...recipe, ingredients: cleanIngredients }),
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

function loadManualShoppingList() {
  try {
    return (JSON.parse(localStorage.getItem("mealPlanGuruManualShoppingList")) || [])
      .map(normalizeManualShoppingItem)
      .filter(Boolean);
  } catch {
    return [];
  }
}

function saveManualShoppingList() {
  localStorage.setItem("mealPlanGuruManualShoppingList", JSON.stringify(manualShoppingItems));
}

function createManualShoppingItemId() {
  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `extra-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizeManualShoppingItem(item) {
  if (typeof item === "string") {
    const label = item.trim();
    return label ? { id: createManualShoppingItemId(), item: label } : null;
  }

  const label = String(item?.item || "").trim();
  if (!label) {
    return null;
  }

  return {
    id: item.id || createManualShoppingItemId(),
    item: label,
  };
}

async function loadInitialManualShoppingList() {
  const supabaseItems = await loadSupabaseManualShoppingList();

  if (supabaseItems.length > 0) {
    manualShoppingItems = supabaseItems;
    saveManualShoppingList();
    return;
  }

  manualShoppingItems = manualShoppingItems.map(normalizeManualShoppingItem).filter(Boolean);
  saveManualShoppingList();
  try {
    await syncManualShoppingListToSupabase();
  } catch (error) {
    console.error(error);
  }
}

function loadCheckedShoppingItems() {
  try {
    return new Set(JSON.parse(localStorage.getItem("mealPlanGuruCheckedShoppingItems")) || []);
  } catch {
    return new Set();
  }
}

function saveCheckedShoppingItems() {
  localStorage.setItem("mealPlanGuruCheckedShoppingItems", JSON.stringify(Array.from(checkedShoppingItems)));
}

function getMealPlanKey(dateKey, mealKey) {
  return `${dateKey}:${mealKey}`;
}

function closeMealDropdowns() {
  document.querySelectorAll(".meal-dropdown").forEach((dropdown) => dropdown.remove());
}

function toggleMealDropdown(mealSlot, dateKey, mealKey) {
  const existingDropdown = document.querySelector(".meal-dropdown");
  const isSameSlot = existingDropdown?.dataset.slotId === getMealPlanKey(dateKey, mealKey);
  closeMealDropdowns();

  if (isSameSlot) {
    return;
  }

  const dropdown = document.createElement("span");
  dropdown.className = "meal-dropdown";
  dropdown.dataset.slotId = getMealPlanKey(dateKey, mealKey);

  const dropdownColumns = MEAL_DROPDOWN_COLUMNS.map(() => {
    const column = document.createElement("span");
    column.className = "meal-dropdown-column";
    dropdown.append(column);
    return column;
  });

  if (recipes.length === 0) {
    appendBuiltInMealOptions(dropdownColumns[0], dateKey, mealKey);
    const emptyItem = document.createElement("span");
    emptyItem.className = "meal-dropdown-empty";
    emptyItem.textContent = "No saved recipes yet";
    dropdownColumns[0].append(emptyItem);
  } else {
    const recipesByLabel = recipes.reduce((groups, recipe) => {
      const label = RECIPE_LABEL_ORDER.includes(recipe.label) ? recipe.label : "";
      groups[label] ||= [];
      groups[label].push(recipe);
      return groups;
    }, {});

    MEAL_DROPDOWN_COLUMNS.forEach((labels, columnIndex) => {
      labels.forEach((label) => {
        if (label === "built-ins") {
          appendBuiltInMealOptions(dropdownColumns[columnIndex], dateKey, mealKey);
          return;
        }

        appendMealRecipeGroup(dropdownColumns[columnIndex], label, recipesByLabel[label] || [], dateKey, mealKey);
      });
    });
  }

  document.body.append(dropdown);
  positionMealDropdown(dropdown, mealSlot);
}

function appendBuiltInMealOptions(container, dateKey, mealKey) {
  const builtInGroup = document.createElement("span");
  builtInGroup.className = "meal-dropdown-group meal-dropdown-built-ins";
  ["Leftovers", "Eating Out"].forEach((builtInOption) => {
    const builtInButton = document.createElement("button");
    builtInButton.className = "meal-dropdown-item meal-dropdown-built-in";
    builtInButton.type = "button";
    builtInButton.textContent = builtInOption;
    builtInButton.addEventListener("click", (event) => {
      event.stopPropagation();
      mealPlan[getMealPlanKey(dateKey, mealKey)] = builtInOption;
      saveMealPlan();
      closeMealDropdowns();
      renderCalendar();
      renderRecipes();
    });
    builtInGroup.append(builtInButton);
  });
  container.append(builtInGroup);
}

function appendMealRecipeGroup(container, label, labelRecipes, dateKey, mealKey) {
  if (labelRecipes.length === 0) {
    return;
  }

  const group = document.createElement("span");
  group.className = "meal-dropdown-group";

  const groupTitle = document.createElement("span");
  groupTitle.className = `meal-dropdown-heading meal-dropdown-heading-${label || "other"}`;
  groupTitle.textContent = RECIPE_LABEL_NAMES[label];
  group.append(groupTitle);

  labelRecipes
    .slice()
    .sort((first, second) => first.name.localeCompare(second.name))
    .forEach((recipe) => {
      const recipeButton = document.createElement("button");
      recipeButton.className = `meal-dropdown-item meal-dropdown-recipe meal-dropdown-recipe-${recipe.label || "other"}`;
      recipeButton.type = "button";
      recipeButton.textContent = recipe.name;
      recipeButton.addEventListener("click", (event) => {
        event.stopPropagation();
        mealPlan[getMealPlanKey(dateKey, mealKey)] = recipe.name;
        saveMealPlan();
        closeMealDropdowns();
        renderCalendar();
        renderRecipes();
      });
      group.append(recipeButton);
    });

  container.append(group);
}

function positionMealDropdown(dropdown, mealSlot) {
  const rect = mealSlot.getBoundingClientRect();
  const gap = 6;
  const dropdownHeight = dropdown.scrollHeight;
  const roomBelow = window.innerHeight - rect.bottom;
  const top =
    roomBelow >= dropdownHeight + gap
      ? rect.bottom + window.scrollY + gap
      : Math.max(window.scrollY + gap, rect.top + window.scrollY - dropdownHeight - gap);

  const width = Math.min(720, Math.max(520, window.innerWidth - 32));
  const left = Math.min(
    Math.max(16, rect.left + window.scrollX + 10),
    window.scrollX + window.innerWidth - width - 16
  );

  dropdown.style.left = `${left}px`;
  dropdown.style.top = `${top}px`;
  dropdown.style.width = `${width}px`;
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

function renderIngredientPreview(container, ingredientLines, limit = DEFAULT_INGREDIENT_PREVIEW_LIMIT) {
  container.innerHTML = "";

  ingredientLines.slice(0, limit).forEach((ingredient, index) => {
    const previewLine = document.createElement("span");
    previewLine.className = "recipe-ingredients-preview-line";
    previewLine.style.setProperty("--preview-index", String(index));
    previewLine.textContent = ingredient;
    container.append(previewLine);
  });

  if (ingredientLines.length > limit) {
    const previewMore = document.createElement("span");
    previewMore.className = "recipe-ingredients-preview-line recipe-ingredients-preview-more";
    previewMore.textContent = "...";
    container.append(previewMore);
  }
}

function compactPreviewForWrappedTitle(card, ingredientLines) {
  const title = card.querySelector(".recipe-card-title");
  const preview = card.querySelector(".recipe-ingredients-preview");

  if (!title || !preview) {
    return;
  }

  const lineHeight = parseFloat(getComputedStyle(title).lineHeight);
  const lineCount = lineHeight > 0 ? Math.round(title.getBoundingClientRect().height / lineHeight) : 1;
  const limit = lineCount > 1 ? COMPACT_INGREDIENT_PREVIEW_LIMIT : DEFAULT_INGREDIENT_PREVIEW_LIMIT;
  renderIngredientPreview(preview, ingredientLines, limit);
}

function refreshRecipePreviewLimits() {
  if (!recipeGrid || recipeGrid.closest("[data-view]")?.hidden) {
    return;
  }

  recipeGrid.querySelectorAll(".recipe-card-filled").forEach((card) => {
    const recipe = recipes.find((item) => item.id === card.dataset.recipeId);
    if (recipe) {
      compactPreviewForWrappedTitle(card, getIngredientLines(recipe.ingredients));
    }
  });
}

function scheduleRecipePreviewRefresh() {
  requestAnimationFrame(() => {
    requestAnimationFrame(refreshRecipePreviewLimits);
  });
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

function getIngredientCategory(ingredient) {
  const item = typeof ingredient === "string" ? ingredient : ingredient.item;
  const original = typeof ingredient === "string" ? ingredient : ingredient.original;
  const text = `${item || ""} ${original || ""}`.toLowerCase();
  const categories = [
    ["Produce", ["onion", "garlic", "fresh tomato", "cherry tomato", "corn on the cob", "potato", "carrot", "celery", "pepper", "lettuce", "spinach", "lemon", "lime", "apple", "banana", "mushroom", "asparagus", "herb", "avocado", "broccoli", "courgette", "zucchini", "aubergine", "pak choi", "spring onion"]],
    ["Meat & Fish", ["chicken", "beef", "pork", "lamb", "turkey", "sausage", "bacon", "fish", "salmon", "tuna", "prawn", "shrimp"]],
    ["Dairy & Alternatives", ["milk", "cheese", "butter", "yogurt", "yoghurt", "cream", "egg", "parmesan", "mozzarella", "cheddar", "oat cream", "heavy cream", "cream cheese"]],
    ["Bakery", ["bread", "bagel", "wrap", "tortilla", "bun", "roll", "pitta", "pita", "pastry"]],
    ["Pasta & Noodles", ["pasta", "spaghetti", "orecchiette", "orzo", "noodle"]],
    ["Rice & Grains", ["rice", "risotto", "arborio", "couscous", "quinoa"]],
    ["Cans & Jars", ["can", "tin", "mutti", "chopped tomato", "kidney bean", "cannellini", "butter bean", "chickpea", "corn", "pitted black olive", "sun-dried tomato"]],
    ["Protein & Nuts", ["tofu", "vegan mince", "lentil", "meatball", "cashew", "nori"]],
    ["Sauces & Condiments", ["tomato purée", "tomato puree", "soy sauce", "tahini", "vinegar", "mayo", "oil", "paste"]],
    ["Stock & Broth", ["stock cube", "veg stock", "vegetable stock", "broth"]],
    ["Herbs & Spices", ["oregano", "paprika", "cumin", "turmeric", "tumeric", "thyme", "rosemary", "bay leaf", "coriander", "parsley", "basil", "herbes de provence", "curry powder", "ginger", "spice"]],
    ["Frozen", ["frozen", "peas", "ice cream"]],
  ];

  const category = categories.find(([, keywords]) => keywords.some((keyword) => text.includes(keyword)));
  return category ? category[0] : "Other";
}

function formatShoppingItem(item) {
  const amount = formatAmount(item.amount);
  const name = item.unit ? item.item : pluralize(item.item, item.amount);

  if (!amount) {
    return item.item;
  }

  if (item.unit) {
    return `${amount} ${pluralize(item.unit, item.amount)} ${name}`;
  }

  return `${amount} ${name}`;
}

function formatShoppingIngredient(item) {
  return item.original || formatShoppingItem(item);
}

function sortShoppingLabels(labels) {
  return [...labels].sort((a, b) => {
    const aStartsWithNumber = /^\d/.test(a.trim());
    const bStartsWithNumber = /^\d/.test(b.trim());

    if (aStartsWithNumber !== bStartsWithNumber) {
      return aStartsWithNumber ? -1 : 1;
    }

    return a.localeCompare(b);
  });
}

function manualShoppingItemToSupabaseRow(item, index = 0) {
  return {
    id: item.id,
    item: item.item,
    sort_order: index,
  };
}

function manualShoppingItemFromSupabaseRow(row) {
  return normalizeManualShoppingItem({
    id: row.id,
    item: row.item,
  });
}

async function loadSupabaseManualShoppingList() {
  if (!supabaseClient) {
    return [];
  }

  const { data, error } = await supabaseClient
    .from(SUPABASE_EXTRAS_TABLE)
    .select("id,item,sort_order")
    .order("sort_order", { ascending: true })
    .order("item", { ascending: true });

  if (error || !Array.isArray(data)) {
    return [];
  }

  return data.map(manualShoppingItemFromSupabaseRow).filter(Boolean);
}

async function saveManualShoppingItemToSupabase(item, sortIndex = 0) {
  if (!supabaseClient) {
    throw new Error("Supabase is not available.");
  }

  const { error } = await supabaseClient
    .from(SUPABASE_EXTRAS_TABLE)
    .upsert(manualShoppingItemToSupabaseRow(item, sortIndex));

  if (error) {
    throw error;
  }
}

async function deleteManualShoppingItemFromSupabase(itemId) {
  if (!supabaseClient || !itemId) {
    throw new Error("Supabase is not available.");
  }

  const { error } = await supabaseClient.from(SUPABASE_EXTRAS_TABLE).delete().eq("id", itemId);

  if (error) {
    throw error;
  }
}

async function syncManualShoppingListToSupabase() {
  if (!supabaseClient || manualShoppingItems.length === 0) {
    return;
  }

  await supabaseClient
    .from(SUPABASE_EXTRAS_TABLE)
    .upsert(manualShoppingItems.map(manualShoppingItemToSupabaseRow));
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
        current.count = (current.count || 1) + 1;
        current.original = formatShoppingItem(current);
        return;
      }

      ingredientMap.set(key, {
        ...parsed,
        amount: parsed.amount === null ? null : parsed.amount,
        count: 1,
        category: getIngredientCategory(parsed),
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

function createShoppingPanel(title, body) {
  const panel = document.createElement("details");
  panel.className = "shopping-category shopping-panel";
  panel.open = true;

  const summary = document.createElement("summary");
  summary.className = "shopping-panel-header";

  const label = document.createElement("span");
  label.textContent = title;

  const icon = document.createElement("span");
  icon.className = "shopping-collapse-icon";
  icon.setAttribute("aria-hidden", "true");

  const panelBody = document.createElement("div");
  panelBody.className = "shopping-panel-body";
  panelBody.append(body);

  summary.append(label, icon);
  panel.append(summary, panelBody);
  return panel;
}

function createShoppingCheckItem(label, key, extraContent = null) {
  const listItem = document.createElement("li");
  listItem.className = "shopping-check-item";
  listItem.classList.toggle("is-checked", checkedShoppingItems.has(key));

  const toggleButton = document.createElement("button");
  toggleButton.type = "button";
  toggleButton.className = "shopping-check-button";
  toggleButton.setAttribute("aria-label", `Toggle ${label}`);
  toggleButton.setAttribute("aria-pressed", String(checkedShoppingItems.has(key)));

  const itemText = document.createElement("span");
  itemText.className = "shopping-check-text";
  itemText.textContent = label;

  const toggleChecked = () => {
    if (checkedShoppingItems.has(key)) {
      checkedShoppingItems.delete(key);
    } else {
      checkedShoppingItems.add(key);
    }

    saveCheckedShoppingItems();
    listItem.classList.toggle("is-checked", checkedShoppingItems.has(key));
    toggleButton.setAttribute("aria-pressed", String(checkedShoppingItems.has(key)));
  };

  toggleButton.addEventListener("click", toggleChecked);
  itemText.addEventListener("click", toggleChecked);

  listItem.append(toggleButton, itemText);
  if (extraContent) {
    listItem.append(extraContent);
  }
  return listItem;
}

function renderShoppingByCategory() {
  if (shoppingItems.length === 0) {
    const empty = document.createElement("p");
    empty.className = "shopping-empty";
    empty.textContent = "Update your planner to get your shopping list";
    shoppingList.append(createShoppingPanel("Shopping List", empty));
    return;
  }

  const groupedItems = shoppingItems.reduce((groups, item) => {
    groups[item.category] ||= [];
    groups[item.category].push(item);
    return groups;
  }, {});

  Object.entries(groupedItems).forEach(([category, items]) => {
    const list = document.createElement("ul");
    sortShoppingLabels(items.map(formatShoppingIngredient)).forEach((label) => {
      list.append(createShoppingCheckItem(label, `auto:category:${category}:${label}`));
    });

    shoppingList.append(createShoppingPanel(category, list));
  });
}

function renderShoppingByRecipe() {
  if (shoppingRecipes.length === 0) {
    const empty = document.createElement("p");
    empty.className = "shopping-empty";
    empty.textContent = "Update your planner to get your shopping list";
    shoppingList.append(createShoppingPanel("Shopping List", empty));
    return;
  }

  shoppingRecipes.forEach((recipe) => {
    const list = document.createElement("ul");
    sortShoppingLabels(recipe.ingredients.map(formatShoppingIngredient)).forEach((label) => {
      list.append(createShoppingCheckItem(label, `auto:recipe:${recipe.id}:${label}`));
    });

    shoppingList.append(createShoppingPanel(recipe.name, list));
  });
}

function renderManualShoppingList() {
  if (!manualShoppingList) {
    return;
  }

  manualShoppingList.innerHTML = "";

  if (manualShoppingItems.length === 0) {
    const empty = document.createElement("li");
    empty.className = "manual-shopping-empty";
    empty.textContent = "No manual items yet.";
    manualShoppingList.append(empty);
    return;
  }

  manualShoppingItems.forEach((manualItem, index) => {
    const item = manualItem.item;
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "manual-shopping-remove";
    removeButton.setAttribute("aria-label", `Remove ${item}`);
    removeButton.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M18 6L6 18" stroke-width="2" stroke-linecap="round"></path>
        <path d="M6 6l12 12" stroke-width="2" stroke-linecap="round"></path>
      </svg>
    `;
    removeButton.addEventListener("click", async () => {
      try {
        await deleteManualShoppingItemFromSupabase(manualItem.id);
      } catch (error) {
        console.error(error);
        alert(`The extra item could not be removed from Supabase: ${error.message || "Please try again."}`);
        return;
      }

      checkedShoppingItems.delete(`manual:${item}`);
      saveCheckedShoppingItems();
      manualShoppingItems.splice(index, 1);
      saveManualShoppingList();
      renderManualShoppingList();
    });

    const listItem = createShoppingCheckItem(item, `manual:${item}`, removeButton);
    const itemText = listItem.querySelector(".shopping-check-text");
    itemText.addEventListener("dblclick", () => {
      const input = document.createElement("input");
      input.className = "manual-shopping-edit-input";
      input.value = item;

      const finishEdit = async (shouldSave) => {
        const nextItem = input.value.trim();

        if (shouldSave && nextItem) {
          const nextManualItem = {
            ...manualItem,
            item: nextItem,
          };
          try {
            await saveManualShoppingItemToSupabase(nextManualItem, index);
          } catch (error) {
            console.error(error);
            alert(`The extra item could not be saved to Supabase: ${error.message || "Please try again."}`);
            renderManualShoppingList();
            return;
          }

          checkedShoppingItems.delete(`manual:${item}`);
          if (listItem.classList.contains("is-checked")) {
            checkedShoppingItems.add(`manual:${nextItem}`);
          }
          manualShoppingItems[index] = nextManualItem;
          saveCheckedShoppingItems();
          saveManualShoppingList();
        }

        renderManualShoppingList();
      };

      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          finishEdit(true);
        }

        if (event.key === "Escape") {
          finishEdit(false);
        }
      });
      input.addEventListener("blur", () => finishEdit(true));

      itemText.replaceWith(input);
      input.focus();
      input.select();
    });

    manualShoppingList.append(listItem);
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

function isRecipePlanned(recipe) {
  return Object.values(mealPlan).includes(recipe.name);
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
  deleteButton.addEventListener("click", () => {
    if (!isAdmin) {
      openAdminRequiredModal();
      return;
    }

    openDeleteModal(card);
  });

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
  editButton.addEventListener("click", () => {
    if (!isAdmin) {
      openAdminRequiredModal();
      return;
    }

    openRecipeModal(recipe);
  });

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

  const ingredientLines = getIngredientLines(recipe.ingredients);
  const ingredientSummary = document.createElement("summary");
  const ingredientPreview = document.createElement("span");
  ingredientPreview.className = "recipe-ingredients-preview";
  renderIngredientPreview(ingredientPreview, ingredientLines);

  ingredientSummary.append(ingredientPreview);

  const ingredientList = document.createElement("ul");
  ingredientList.className = "recipe-ingredients-list";
  ingredientList.addEventListener("click", () => {
    ingredientDetails.open = false;
  });

  ingredientLines.forEach((ingredient) => {
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

  const titleRow = document.createElement("div");
  titleRow.className = "recipe-card-title-row";
  titleRow.append(title);

  if (recipe.label) {
    const label = document.createElement("span");
    label.className = `recipe-label recipe-label-${recipe.label}`;
    label.textContent = recipe.label;
    titleRow.append(label);
  }

  textContent.append(titleRow, ingredientDetails);

  actions.append(editButton, deleteButton);
  card.classList.add("has-card-actions");

  if (isRecipePlanned(recipe)) {
    const plannedBadge = document.createElement("span");
    plannedBadge.className = "recipe-planned-badge";
    plannedBadge.setAttribute("aria-label", "Added to meal planner");
    plannedBadge.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M5 12.5l4.2 4.2L19 7" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"></path>
      </svg>
    `;
    actions.append(plannedBadge);
    card.classList.add("has-card-actions");
  }

  content.append(textContent);
  if (actions.children.length > 0) {
    content.append(actions);
  }
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
    const card = createRecipeCard(recipe);
    recipeGrid.insertBefore(card, addRecipeButton);
    compactPreviewForWrappedTitle(card, getIngredientLines(recipe.ingredients));
  });
  scheduleRecipePreviewRefresh();
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
authButton?.addEventListener("click", async () => {
  if (isAdmin) {
    await supabaseClient?.auth.signOut();
    return;
  }

  openAuthModal();
});
closeAuthButton?.addEventListener("click", closeAuthModal);
updateShoppingButton?.addEventListener("click", () => {
  shoppingItems = buildShoppingList();
  shoppingRecipes = buildShoppingRecipes();
  saveShoppingList();
  saveShoppingRecipes();
  renderShoppingList();
  openShoppingUpdatedModal();
});
closeShoppingUpdatedButton?.addEventListener("click", closeShoppingUpdatedModal);
closeAdminRequiredButton?.addEventListener("click", closeAdminRequiredModal);
shoppingViewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setShoppingView(button.dataset.shoppingView);
  });
});
manualShoppingForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const input = manualShoppingForm.elements.manualItem;
  const item = String(input.value || "").trim();

  if (!item) {
    return;
  }

  const manualItem = {
    id: createManualShoppingItemId(),
    item,
  };

  try {
    await saveManualShoppingItemToSupabase(manualItem, manualShoppingItems.length);
  } catch (error) {
    console.error(error);
    alert(`The extra item could not be saved to Supabase: ${error.message || "Please try again."}`);
    return;
  }

  manualShoppingItems.push(manualItem);
  saveManualShoppingList();
  renderManualShoppingList();
  manualShoppingForm.reset();
  input.focus();
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
passwordForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const password = passwordInput?.value || "";

  if (password === SITE_PASSWORD) {
    unlockSite();
    return;
  }

  passwordError.hidden = false;
  passwordInput?.select();
});
lockSiteButton?.addEventListener("click", lockSite);
authForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (authLinkSent) {
    closeAuthModal();
    return;
  }

  if (!supabaseClient) {
    authMessage.textContent = "Admin login is not available right now.";
    return;
  }

  const { error } = await supabaseClient.auth.signInWithOtp({
    email: ADMIN_EMAIL,
    options: {
      emailRedirectTo: ADMIN_REDIRECT_URL,
    },
  });

  if (error) {
    authMessage.textContent = `Could not send the login link: ${error.message}`;
    return;
  }

  authLinkSent = true;
  authMessage.innerHTML = "<strong>Link sent</strong><br>Check your email";
  if (adminChoiceButton) {
    adminChoiceButton.textContent = "OK";
    adminChoiceButton.classList.add("is-confirmation");
    adminChoiceButton.focus();
  }
});
authModal?.addEventListener("click", (event) => {
  if (event.target === authModal) {
    closeAuthModal();
  }
});
confirmDeleteButton?.addEventListener("click", async () => {
  if (!isAdmin) {
    closeDeleteModal();
    openAuthModal();
    return;
  }

  const recipeId = pendingDeleteCard?.dataset.recipeId;
  const recipeToDelete = recipes.find((recipe) => recipe.id === recipeId);
  try {
    await deleteRecipeFromSupabase(recipeId);
  } catch (error) {
    console.error(error);
    alert(`The recipe could not be deleted from Supabase: ${error.message || "Please try again."}`);
    return;
  }

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
  renderRecipes();
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

adminRequiredModal?.addEventListener("click", (event) => {
  if (event.target === adminRequiredModal) {
    closeAdminRequiredModal();
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

  if (event.key === "Escape" && adminRequiredModal && !adminRequiredModal.hidden) {
    closeAdminRequiredModal();
  }

  if (event.key === "Escape" && authModal && !authModal.hidden) {
    closeAuthModal();
  }
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".meal-slot")) {
    closeMealDropdowns();
  }

  if (!event.target.closest(".recipe-ingredients")) {
    document.querySelectorAll(".recipe-ingredients[open]").forEach((details) => {
      details.open = false;
    });
  }
});

recipeForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!isAdmin) {
    closeRecipeModal();
    openAuthModal();
    return;
  }

  const formData = new FormData(recipeForm);
  const recipeName = String(formData.get("recipeName") || "").trim();
  const ingredients = cleanRecipeIngredients(formData.get("ingredients"));
  const label = String(formData.get("label") || "");
  const photoFile = formData.get("photoFile");

  if (!recipeName || !ingredients) {
    return;
  }

  const recipeId = editingRecipeId || createRecipeId();
  const existingRecipe = editingRecipeId ? recipes.find((recipe) => recipe.id === editingRecipeId) : null;
  const draftRecipe = {
    id: recipeId,
    name: recipeName,
    ingredients,
    label,
    photoUrl: existingRecipe?.photoUrl || "",
  };
  let photoUrl = draftRecipe.photoUrl;

  try {
    photoUrl = await uploadRecipePhoto(photoFile, draftRecipe) || photoUrl;
  } catch {
    alert("The photo could not be uploaded. Please check Supabase Storage and try again.");
    return;
  }

  let nextRecipes = recipes;
  let nextMealPlan = { ...mealPlan };

  if (editingRecipeId) {
    const oldRecipe = existingRecipe;
    nextRecipes = recipes.map((recipe) => {
      if (recipe.id !== editingRecipeId) {
        return recipe;
      }

      return {
        ...recipe,
        name: recipeName,
        ingredients,
        label,
        photoUrl,
      };
    });

    if (oldRecipe && oldRecipe.name !== recipeName) {
      Object.keys(nextMealPlan).forEach((key) => {
        if (nextMealPlan[key] === oldRecipe.name) {
          nextMealPlan[key] = recipeName;
        }
      });
    }
  } else {
    nextRecipes = [{
      id: recipeId,
      name: recipeName,
      ingredients,
      label,
      photoUrl,
    }, ...recipes];
  }

  const savedRecipe = editingRecipeId
    ? nextRecipes.find((recipe) => recipe.id === editingRecipeId)
    : nextRecipes[0];

  try {
    await saveRecipeToSupabase(savedRecipe, nextRecipes.findIndex((recipe) => recipe.id === savedRecipe.id));
  } catch (error) {
    console.error(error);
    alert(`The recipe could not be saved to Supabase: ${error.message || "Please try again."}`);
    return;
  }

  recipes = nextRecipes;
  mealPlan = nextMealPlan;
  saveRecipes();
  saveMealPlan();
  renderRecipes();
  renderCalendar();
  recipeForm.reset();
  closeRecipeModal();
});

async function initializeApp() {
  initializePasswordGate();
  await initializeAuth();
  await loadInitialRecipes();
  await loadInitialManualShoppingList();
  showView(window.location.hash.replace("#", ""));
  renderCalendar();
  renderRecipes();
  renderShoppingList();
  renderManualShoppingList();
}

initializeApp();
