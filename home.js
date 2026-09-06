import {
  auth,
  db,
  onAuthStateChanged,
  signOut,
  doc,
  getDoc,
  getDocs,
  collection,
} from "./firebase-config.js";

const sidebar = document.getElementById("sidePanel");
const sidebarToggle = document.getElementById("sidebarToggle");
const sidebarOverlay = document.getElementById("sidebarOverlay");

const accountButton = document.getElementById("accountButton");
const accountDropdown = document.getElementById("accountDropdown");

const groupsArrow = document.getElementById("groupsArrow");
const groupsSubmenu = document.getElementById("groupsSubmenu");

const navProfilePicture = document.getElementById("navProfilePicture");

const navUsername = document.getElementById("navUsername");

const dropdownProfilePicture = document.getElementById(
  "dropdownProfilePicture"
);

const dropdownName = document.getElementById("dropdownName");

const dropdownEmail = document.getElementById("dropdownEmail");

const signOutButton = document.getElementById("signOutButton");

const welcomeMessage = document.getElementById("welcomeMessage");

const leaderboardBody = document.getElementById("globalLeaderboardBody");

const leaderboardGrade = document.getElementById("globalGradeFilter");

const leaderboardSort = document.getElementById("globalSort");

let leaderboardUsers = [];

// --------------------------------------------------
// SIDEBAR
// --------------------------------------------------

if (sidebarToggle && sidebar) {
  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");

    if (sidebarOverlay) {
      sidebarOverlay.classList.toggle("show");
    }
  });
}

if (sidebarOverlay && sidebar) {
  sidebarOverlay.addEventListener("click", () => {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("show");
  });
}

// --------------------------------------------------
// ACCOUNT DROPDOWN
// --------------------------------------------------

if (accountButton && accountDropdown) {
  accountButton.addEventListener("click", (event) => {
    event.stopPropagation();

    accountDropdown.classList.toggle("show");
    accountButton.classList.toggle("open");
  });

  accountDropdown.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", () => {
    accountDropdown.classList.remove("show");
    accountButton.classList.remove("open");
  });
}

// --------------------------------------------------
// GROUPS DROPDOWN
// --------------------------------------------------

if (groupsArrow && groupsSubmenu) {
  groupsArrow.addEventListener("click", (event) => {
    event.stopPropagation();

    groupsSubmenu.classList.toggle("show");
    groupsArrow.classList.toggle("open");
  });
}

// --------------------------------------------------
// SIGN OUT
// --------------------------------------------------

if (signOutButton) {
  signOutButton.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "index.html";
    } catch (error) {
      console.error("Sign out error:", error);
    }
  });
}

// --------------------------------------------------
// DEFAULT PROFILE PICTURE
// --------------------------------------------------

function createDefaultProfilePicture() {
  return (
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 40 40"
      >
        <circle
          cx="20"
          cy="20"
          r="20"
          fill="#444"
        />

        <circle
          cx="20"
          cy="16"
          r="7"
          fill="#aaa"
        />

        <path
          d="M8 35c1-8 6-12 12-12s11 4 12 12"
          fill="#aaa"
        />
      </svg>
    `)
  );
}

// --------------------------------------------------
// SET PROFILE PICTURE
// --------------------------------------------------

function setProfilePicture(imageElement, photoURL) {
  if (!imageElement) return;

  const defaultPicture = createDefaultProfilePicture();

  imageElement.src = photoURL || defaultPicture;

  imageElement.onerror = () => {
    imageElement.onerror = null;
    imageElement.src = defaultPicture;
  };
}

// --------------------------------------------------
// NUMBER HELPER
// --------------------------------------------------

function numberValue(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return number;
}

// --------------------------------------------------
// GRADE / UNIT HELPERS
// --------------------------------------------------

function getGrade(gradeLevel) {
  if (!gradeLevel || typeof gradeLevel !== "string") {
    return "—";
  }

  const parts = gradeLevel.split(".");

  return parts[0] || "—";
}

function getUnit(gradeLevel) {
  if (!gradeLevel || typeof gradeLevel !== "string") {
    return "—";
  }

  const parts = gradeLevel.split(".");

  return parts[1] || "—";
}

// --------------------------------------------------
// AUTH STATE
// --------------------------------------------------

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  await loadCurrentUser(user);
  await loadGlobalLeaderboard();
});

// --------------------------------------------------
// LOAD CURRENT USER
// --------------------------------------------------

async function loadCurrentUser(user) {
  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    let data = {};

    if (userSnap.exists()) {
      data = userSnap.data();
    }

    const name = data.displayName || user.displayName || "Account";

    const email = data.email || user.email || "";

    const photoURL = data.photoURL || user.photoURL || "";

    // ----------------------------------------------
    // NAVBAR ACCOUNT
    // ----------------------------------------------

    if (navUsername) {
      navUsername.textContent = name;
    }

    setProfilePicture(navProfilePicture, photoURL);

    // ----------------------------------------------
    // ACCOUNT DROPDOWN
    // ----------------------------------------------

    if (dropdownName) {
      dropdownName.textContent = name;
    }

    if (dropdownEmail) {
      dropdownEmail.textContent = email;
    }

    setProfilePicture(dropdownProfilePicture, photoURL);

    // ----------------------------------------------
    // WELCOME MESSAGE
    // ----------------------------------------------

    if (welcomeMessage) {
      welcomeMessage.textContent = `Welcome to Infinite Math, ${name}!`;
    }
  } catch (error) {
    console.error("Error loading current user:", error);

    const name = user.displayName || "Account";

    const email = user.email || "";

    const photoURL = user.photoURL || "";

    if (navUsername) {
      navUsername.textContent = name;
    }

    if (dropdownName) {
      dropdownName.textContent = name;
    }

    if (dropdownEmail) {
      dropdownEmail.textContent = email;
    }

    setProfilePicture(navProfilePicture, photoURL);

    setProfilePicture(dropdownProfilePicture, photoURL);

    if (welcomeMessage) {
      welcomeMessage.textContent = `Welcome to Infinite Math, ${name}!`;
    }
  }
}

// --------------------------------------------------
// LOAD GLOBAL LEADERBOARD
// --------------------------------------------------

async function loadGlobalLeaderboard() {
  if (!leaderboardBody) return;

  leaderboardBody.innerHTML = `
    <tr>
      <td colspan="6" class="leaderboard-loading">
        Loading leaderboard...
      </td>
    </tr>
  `;

  try {
    const usersSnapshot = await getDocs(collection(db, "users"));

    leaderboardUsers = [];

    usersSnapshot.forEach((userDocument) => {
      const data = userDocument.data();

      leaderboardUsers.push({
        id: userDocument.id,

        displayName: data.displayName || "Unnamed Player",

        // Saved profile picture
        photoURL: data.photoURL || "",

        grade: getGrade(data.gradeLevel),

        unit: getUnit(data.gradeLevel),

        xp: numberValue(data.xp),

        lessons: numberValue(data.lessonsCompleted),
      });
    });

    renderGlobalLeaderboard();
  } catch (error) {
    console.error("Error loading global leaderboard:", error);

    leaderboardBody.innerHTML = `
      <tr>
        <td colspan="6">
          Unable to load leaderboard.
        </td>
      </tr>
    `;
  }
}

// --------------------------------------------------
// FILTER / SORT EVENTS
// --------------------------------------------------

if (leaderboardGrade) {
  leaderboardGrade.addEventListener("change", renderGlobalLeaderboard);
}

if (leaderboardSort) {
  leaderboardSort.addEventListener("change", renderGlobalLeaderboard);
}

// --------------------------------------------------
// RENDER GLOBAL LEADERBOARD
// --------------------------------------------------

function renderGlobalLeaderboard() {
  if (!leaderboardBody) return;

  let users = [...leaderboardUsers];

  // ----------------------------------------------
  // GRADE FILTER
  // ----------------------------------------------

  const selectedGrade = leaderboardGrade?.value || "all";

  if (selectedGrade !== "all") {
    users = users.filter((user) => user.grade === selectedGrade);
  }

  // ----------------------------------------------
  // SORT
  // ----------------------------------------------

  const sortBy = leaderboardSort?.value || "xp";

  if (sortBy === "lessons") {
    users.sort(
      (a, b) =>
        b.lessons - a.lessons ||
        b.xp - a.xp ||
        a.displayName.localeCompare(b.displayName)
    );
  } else {
    users.sort(
      (a, b) =>
        b.xp - a.xp ||
        b.lessons - a.lessons ||
        a.displayName.localeCompare(b.displayName)
    );
  }

  // ----------------------------------------------
  // CLEAR TABLE
  // ----------------------------------------------

  leaderboardBody.innerHTML = "";

  // ----------------------------------------------
  // EMPTY
  // ----------------------------------------------

  if (users.length === 0) {
    leaderboardBody.innerHTML = `
      <tr>
        <td colspan="6">
          No players match this filter.
        </td>
      </tr>
    `;

    return;
  }

  // ----------------------------------------------
  // CREATE ROWS
  // ----------------------------------------------

  users.forEach((user, index) => {
    const row = document.createElement("tr");

    // Rank
    const rank = document.createElement("td");

    rank.textContent = index + 1;

    // Player
    const player = document.createElement("td");

    player.className = "leaderboard-player";

    // Profile picture
    const picture = document.createElement("img");

    picture.className = "leaderboard-profile-picture";

    picture.width = 40;
    picture.height = 40;

    picture.alt = `${user.displayName}'s profile picture`;

    if (user.photoURL) {
      picture.src = user.photoURL;
    } else {
      picture.src = createDefaultProfilePicture();
    }

    picture.onerror = () => {
      picture.onerror = null;

      picture.src = createDefaultProfilePicture();
    };

    // Player name
    const playerName = document.createElement("span");

    playerName.textContent = user.displayName;

    player.appendChild(picture);

    player.appendChild(playerName);

    // Grade
    const grade = document.createElement("td");

    grade.textContent = user.grade;

    // Unit
    const unit = document.createElement("td");

    unit.textContent = user.unit;

    // XP
    const xp = document.createElement("td");

    xp.textContent = user.xp.toLocaleString();

    // Lessons
    const lessons = document.createElement("td");

    lessons.textContent = user.lessons.toLocaleString();

    // Add cells
    row.appendChild(rank);

    row.appendChild(player);

    row.appendChild(grade);

    row.appendChild(unit);

    row.appendChild(xp);

    row.appendChild(lessons);

    leaderboardBody.appendChild(row);
  });
}
