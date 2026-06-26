const STORAGE_KEY = "neurocat-lab-planner";

const initialChecklist = [
  "Prepare materials",
  "Label samples",
  "Check protocol steps",
  "Record observations",
];

const scenes = [
  { id: "park", moodPrefix: "Park patrol" },
  { id: "city", moodPrefix: "City stroll" },
  { id: "campus", moodPrefix: "Campus watch" },
];

let state = loadState();
let petStreak = 0;
let petResetTimer;
let reactionTimer;
let catReaction = "idle";

const els = {
  sectionTabs: document.querySelectorAll(".tab-button"),
  appSections: document.querySelectorAll(".app-section"),
  catPanel: document.querySelector(".cat-panel"),
  sceneSelect: document.querySelector("#sceneSelect"),
  taskForm: document.querySelector("#taskForm"),
  taskInput: document.querySelector("#taskInput"),
  taskCategory: document.querySelector("#taskCategory"),
  taskList: document.querySelector("#taskList"),
  clearDoneButton: document.querySelector("#clearDoneButton"),
  deadlineForm: document.querySelector("#deadlineForm"),
  deadlineTitle: document.querySelector("#deadlineTitle"),
  deadlineDate: document.querySelector("#deadlineDate"),
  deadlineType: document.querySelector("#deadlineType"),
  deadlineList: document.querySelector("#deadlineList"),
  readingForm: document.querySelector("#readingForm"),
  readingInput: document.querySelector("#readingInput"),
  readingList: document.querySelector("#readingList"),
  checklistForm: document.querySelector("#checklistForm"),
  checklistInput: document.querySelector("#checklistInput"),
  checklist: document.querySelector("#checklist"),
  resetChecklistButton: document.querySelector("#resetChecklistButton"),
  feedCatButton: document.querySelector("#feedCatButton"),
  petCatButton: document.querySelector("#petCatButton"),
  catMood: document.querySelector("#catMood"),
  catLevel: document.querySelector("#catLevel"),
  moodBar: document.querySelector("#moodBar"),
  tasksDone: document.querySelector("#tasksDone"),
  deadlineCount: document.querySelector("#deadlineCount"),
  readingCount: document.querySelector("#readingCount"),
  checklistProgress: document.querySelector("#checklistProgress"),
  mediaForm: document.querySelector("#mediaForm"),
  mediaTitle: document.querySelector("#mediaTitle"),
  mediaType: document.querySelector("#mediaType"),
  mediaUploader: document.querySelector("#mediaUploader"),
  mediaGenre: document.querySelector("#mediaGenre"),
  mediaGroups: document.querySelector("#mediaGroups"),
  treatForm: document.querySelector("#treatForm"),
  treatDate: document.querySelector("#treatDate"),
  treatTitle: document.querySelector("#treatTitle"),
  treatType: document.querySelector("#treatType"),
  treatCalendar: document.querySelector("#treatCalendar"),
  dateIdeaForm: document.querySelector("#dateIdeaForm"),
  dateIdeaTitle: document.querySelector("#dateIdeaTitle"),
  dateIdeaUploader: document.querySelector("#dateIdeaUploader"),
  dateIdeaCategory: document.querySelector("#dateIdeaCategory"),
  dateIdeaGroups: document.querySelector("#dateIdeaGroups"),
};

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) {
    return {
      cat: 32,
      scene: "park",
      activeSection: "lab",
      tasks: [],
      deadlines: [],
      readings: [],
      checklist: initialChecklist.map((title) => createItem({ title })),
      media: [],
      treats: [],
      dateIdeas: [],
    };
  }

  try {
    return {
      scene: "park",
      activeSection: "lab",
      media: [],
      treats: [],
      dateIdeas: [],
      ...JSON.parse(saved),
    };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return loadState();
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function createItem(details) {
  return {
    id: crypto.randomUUID(),
    title: details.title.trim(),
    done: false,
    createdAt: new Date().toISOString(),
    ...details,
  };
}

function clampCat(value) {
  return Math.max(0, Math.min(100, value));
}

function rewardCat(points) {
  state.cat = clampCat(state.cat + points);
}

function reactCat(type, duration = 1800) {
  window.clearTimeout(reactionTimer);
  catReaction = type;
  els.catPanel.dataset.reaction = type;
  renderStats();

  reactionTimer = window.setTimeout(() => {
    catReaction = "idle";
    els.catPanel.dataset.reaction = "idle";
    renderStats();
  }, duration);
}

function resetPetStreakSoon() {
  window.clearTimeout(petResetTimer);
  petResetTimer = window.setTimeout(() => {
    petStreak = 0;
  }, 6500);
}

function petCat() {
  petStreak += 1;
  resetPetStreakSoon();

  if (petStreak <= 3) {
    rewardCat(4);
    reactCat("petted", 1900);
    render();
    return;
  }

  if (petStreak === 4) {
    rewardCat(-2);
    reactCat("annoyed", 2200);
    render();
    return;
  }

  rewardCat(-8);
  reactCat("angry", 2600);
  render();
}

function render() {
  renderSections();
  renderScene();
  renderTasks();
  renderDeadlines();
  renderReadings();
  renderChecklist();
  renderMedia();
  renderTreats();
  renderDateIdeas();
  renderStats();
  saveState();
}

function renderSections() {
  const allowed = ["lab", "cinema", "treats", "dates"];
  if (!allowed.includes(state.activeSection)) state.activeSection = "lab";

  els.sectionTabs.forEach((button) => {
    const isActive = button.dataset.sectionTarget === state.activeSection;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  els.appSections.forEach((section) => {
    section.classList.toggle("active", section.dataset.section === state.activeSection);
  });
}

function renderTasks() {
  renderList({
    element: els.taskList,
    items: state.tasks,
    empty: "No tasks yet. The lab cat is suspiciously available.",
    getMeta: (item) => [`${item.category}`],
    onToggle: (item) => {
      item.done = !item.done;
      rewardCat(item.done ? 8 : -4);
      reactCat(item.done ? "pleased" : "curious");
    },
    onDelete: (id) => {
      state.tasks = state.tasks.filter((item) => item.id !== id);
      reactCat("startled");
    },
  });
}

function renderDeadlines() {
  state.deadlines.sort((a, b) => new Date(a.date) - new Date(b.date));

  renderList({
    element: els.deadlineList,
    items: state.deadlines,
    empty: "No deadlines tracked.",
    getMeta: (item) => [item.type, formatDeadline(item.date)],
    onToggle: (item) => {
      item.done = !item.done;
      rewardCat(item.done ? 10 : -5);
      reactCat(item.done ? "pleased" : "curious");
    },
    onDelete: (id) => {
      state.deadlines = state.deadlines.filter((item) => item.id !== id);
      reactCat("startled");
    },
  });
}

function renderReadings() {
  renderList({
    element: els.readingList,
    items: state.readings,
    empty: "No papers or chapters waiting.",
    getMeta: (item) => [item.done ? "Read" : "Unread"],
    onToggle: (item) => {
      item.done = !item.done;
      rewardCat(item.done ? 7 : -3);
      reactCat(item.done ? "pleased" : "curious");
    },
    onDelete: (id) => {
      state.readings = state.readings.filter((item) => item.id !== id);
      reactCat("startled");
    },
  });
}

function renderChecklist() {
  renderList({
    element: els.checklist,
    items: state.checklist,
    empty: "No protocol steps yet.",
    getMeta: (item) => [item.done ? "Complete" : "Pending"],
    onToggle: (item) => {
      item.done = !item.done;
      rewardCat(item.done ? 6 : -3);
      reactCat(item.done ? "pleased" : "curious");
    },
    onDelete: (id) => {
      state.checklist = state.checklist.filter((item) => item.id !== id);
      reactCat("startled");
    },
  });
}

function renderMedia() {
  const items = [...state.media].sort(
    (a, b) =>
      a.uploader.localeCompare(b.uploader) ||
      a.genre.localeCompare(b.genre) ||
      a.title.localeCompare(b.title),
  );

  renderGroupedCards({
    element: els.mediaGroups,
    items,
    empty: "No movie or series ideas yet.",
    groupBy: (item) => `${item.uploader} - ${item.genre}`,
    metaFor: (item) => [item.type],
    onDelete: (id) => {
      state.media = state.media.filter((item) => item.id !== id);
      reactCat("startled");
    },
  });
}

function renderTreats() {
  const items = [...state.treats].sort((a, b) => new Date(a.date) - new Date(b.date));

  renderGroupedCards({
    element: els.treatCalendar,
    items,
    empty: "No treat days planned yet.",
    groupBy: (item) => formatCalendarDate(item.date),
    metaFor: (item) => [item.type],
    onDelete: (id) => {
      state.treats = state.treats.filter((item) => item.id !== id);
      reactCat("startled");
    },
  });
}

function renderDateIdeas() {
  const items = [...state.dateIdeas].sort(
    (a, b) =>
      a.uploader.localeCompare(b.uploader) ||
      a.category.localeCompare(b.category) ||
      a.title.localeCompare(b.title),
  );

  renderGroupedCards({
    element: els.dateIdeaGroups,
    items,
    empty: "No date ideas yet.",
    groupBy: (item) => `${item.uploader} - ${item.category}`,
    metaFor: () => ["Idea"],
    onDelete: (id) => {
      state.dateIdeas = state.dateIdeas.filter((item) => item.id !== id);
      reactCat("startled");
    },
  });
}

function renderList({ element, items, empty, getMeta, onToggle, onDelete }) {
  element.innerHTML = "";

  if (!items.length) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-state";
    emptyItem.textContent = empty;
    element.append(emptyItem);
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("li");
    row.className = `item${item.done ? " done" : ""}`;

    const check = document.createElement("button");
    check.className = "check-button";
    check.type = "button";
    check.setAttribute("aria-label", item.done ? "Mark incomplete" : "Mark complete");
    check.textContent = item.done ? "OK" : "";
    check.addEventListener("click", () => {
      onToggle(item);
      render();
    });

    const content = document.createElement("div");
    const title = document.createElement("span");
    title.className = "item-title";
    title.textContent = item.title;

    const meta = document.createElement("span");
    meta.className = "meta";
    getMeta(item).forEach((value) => {
      const pill = document.createElement("span");
      pill.className = `pill${String(value).includes("Overdue") ? " danger" : ""}`;
      pill.textContent = value;
      meta.append(pill);
    });

    content.append(title, meta);

    const remove = document.createElement("button");
    remove.className = "delete-button";
    remove.type = "button";
    remove.setAttribute("aria-label", "Delete item");
    remove.textContent = "x";
    remove.addEventListener("click", () => {
      onDelete(item.id);
      rewardCat(-2);
      render();
    });

    row.append(check, content, remove);
    element.append(row);
  });
}

function renderGroupedCards({ element, items, empty, groupBy, metaFor, onDelete }) {
  element.innerHTML = "";

  if (!items.length) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.textContent = empty;
    element.append(emptyState);
    return;
  }

  const groups = new Map();
  items.forEach((item) => {
    const key = groupBy(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  });

  groups.forEach((groupItems, title) => {
    const group = document.createElement("section");
    group.className = "group-block";

    const heading = document.createElement("h3");
    heading.textContent = title;

    const list = document.createElement("ul");
    list.className = "item-list grouped-items";

    groupItems.forEach((item) => {
      const row = document.createElement("li");
      row.className = "item grouped-item";

      const icon = document.createElement("span");
      icon.className = "mini-check";
      icon.textContent = "NC";

      const content = document.createElement("div");
      const itemTitle = document.createElement("span");
      itemTitle.className = "item-title";
      itemTitle.textContent = item.title;

      const meta = document.createElement("span");
      meta.className = "meta";
      metaFor(item).forEach((value) => {
        const pill = document.createElement("span");
        pill.className = "pill";
        pill.textContent = value;
        meta.append(pill);
      });

      content.append(itemTitle, meta);

      const remove = document.createElement("button");
      remove.className = "delete-button";
      remove.type = "button";
      remove.setAttribute("aria-label", "Delete item");
      remove.textContent = "x";
      remove.addEventListener("click", () => {
        onDelete(item.id);
        rewardCat(-1);
        render();
      });

      row.append(icon, content, remove);
      list.append(row);
    });

    group.append(heading, list);
    element.append(group);
  });
}

function renderStats() {
  const tasksDone = state.tasks.filter((item) => item.done).length;
  const activeDeadlines = state.deadlines.filter((item) => !item.done).length;
  const unread = state.readings.filter((item) => !item.done).length;
  const completeSteps = state.checklist.filter((item) => item.done).length;
  const checklistProgress = state.checklist.length
    ? Math.round((completeSteps / state.checklist.length) * 100)
    : 0;

  els.tasksDone.textContent = tasksDone;
  els.deadlineCount.textContent = activeDeadlines;
  els.readingCount.textContent = unread;
  els.checklistProgress.textContent = `${checklistProgress}%`;

  els.catLevel.textContent = `${state.cat}%`;
  els.moodBar.style.width = `${state.cat}%`;
  els.catMood.textContent = `${getSceneMood()} - ${getCatMood(state.cat)}`;
}

function renderScene() {
  const scene = scenes.find((item) => item.id === state.scene) || scenes[0];
  state.scene = scene.id;
  els.catPanel.dataset.scene = scene.id;
  els.catPanel.dataset.reaction = catReaction;
  els.sceneSelect.value = scene.id;
}

function getSceneMood() {
  return scenes.find((scene) => scene.id === state.scene)?.moodPrefix || scenes[0].moodPrefix;
}

function getCatMood(value) {
  if (value >= 85) return "Purring";
  if (value >= 65) return "Happy";
  if (value >= 40) return "Curious";
  if (value >= 20) return "Plotting";
  return "Haunting";
}

function formatDeadline(dateString) {
  const today = new Date();
  const target = new Date(`${dateString}T12:00:00`);
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = Math.ceil((target - startOfDay(today)) / msPerDay);

  if (diff < 0) return `Overdue by ${Math.abs(diff)} day${Math.abs(diff) === 1 ? "" : "s"}`;
  if (diff === 0) return "Due today";
  if (diff === 1) return "Due tomorrow";
  return `Due in ${diff} days`;
}

function formatCalendarDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

els.sectionTabs.forEach((button) => {
  button.addEventListener("click", () => {
    state.activeSection = button.dataset.sectionTarget;
    petStreak = 0;
    reactCat("curious");
    render();
  });
});

els.taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.tasks.unshift(
    createItem({
      title: els.taskInput.value,
      category: els.taskCategory.value,
    }),
  );
  els.taskForm.reset();
  petStreak = 0;
  reactCat("working");
  render();
});

els.sceneSelect.addEventListener("change", () => {
  state.scene = els.sceneSelect.value;
  petStreak = 0;
  reactCat("curious");
  render();
});

els.deadlineForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.deadlines.push(
    createItem({
      title: els.deadlineTitle.value,
      date: els.deadlineDate.value,
      type: els.deadlineType.value,
    }),
  );
  els.deadlineForm.reset();
  petStreak = 0;
  reactCat("working");
  render();
});

els.readingForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.readings.unshift(createItem({ title: els.readingInput.value }));
  els.readingForm.reset();
  petStreak = 0;
  reactCat("working");
  render();
});

els.checklistForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.checklist.push(createItem({ title: els.checklistInput.value }));
  els.checklistForm.reset();
  petStreak = 0;
  reactCat("working");
  render();
});

els.mediaForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.media.push(
    createItem({
      title: els.mediaTitle.value,
      type: els.mediaType.value,
      uploader: els.mediaUploader.value,
      genre: els.mediaGenre.value,
    }),
  );
  els.mediaForm.reset();
  petStreak = 0;
  reactCat("pleased");
  rewardCat(3);
  render();
});

els.treatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.treats.push(
    createItem({
      title: els.treatTitle.value,
      date: els.treatDate.value,
      type: els.treatType.value,
    }),
  );
  els.treatForm.reset();
  petStreak = 0;
  reactCat("fed", 2400);
  rewardCat(5);
  render();
});

els.dateIdeaForm.addEventListener("submit", (event) => {
  event.preventDefault();
  state.dateIdeas.push(
    createItem({
      title: els.dateIdeaTitle.value,
      uploader: els.dateIdeaUploader.value,
      category: els.dateIdeaCategory.value,
    }),
  );
  els.dateIdeaForm.reset();
  petStreak = 0;
  reactCat("petted", 1900);
  rewardCat(4);
  render();
});

els.clearDoneButton.addEventListener("click", () => {
  state.tasks = state.tasks.filter((item) => !item.done);
  petStreak = 0;
  reactCat("startled");
  render();
});

els.resetChecklistButton.addEventListener("click", () => {
  state.checklist.forEach((item) => {
    item.done = false;
  });
  rewardCat(-8);
  petStreak = 0;
  reactCat("annoyed");
  render();
});

els.feedCatButton.addEventListener("click", () => {
  petStreak = 0;
  rewardCat(12);
  reactCat("fed", 2400);
  render();
});

els.petCatButton.addEventListener("click", () => {
  petCat();
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js");
  });
}

render();
