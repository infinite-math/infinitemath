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

// --------------------------------------------------
// ELEMENTS
// --------------------------------------------------

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

const groupsContent = document.getElementById("groupsContent");

const groupsGrid = document.getElementById("groupsGrid");

const groupsEmpty = document.getElementById("groupsEmpty");

const singleGroupContent = document.getElementById("singleGroupContent");

const selectedGroupHeader = document.getElementById("selectedGroupHeader");

const groupMemberCount = document.getElementById("groupMemberCount");

const groupGradeFilter = document.getElementById("groupGradeFilter");

const groupSort = document.getElementById("groupSort");

const groupLeaderboardBody = document.getElementById("groupLeaderboardBody");

let currentUser = null;
let groupMembers = [];

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
// PROFILE PICTURE
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
// GRADE / UNIT
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
// ESCAPE HTML
// --------------------------------------------------

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// --------------------------------------------------
// AUTH
// --------------------------------------------------

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  currentUser = user;

  await loadCurrentUserProfile();

  const urlParams = new URLSearchParams(window.location.search);

  const groupId = urlParams.get("id");

  if (groupId) {
    await loadSingleGroup(groupId);
  } else {
    await loadUserGroups();
  }
});

// --------------------------------------------------
// LOAD CURRENT USER
// --------------------------------------------------

async function loadCurrentUserProfile() {
  try {
    const userRef = doc(db, "users", currentUser.uid);

    const userSnap = await getDoc(userRef);

    let data = {};

    if (userSnap.exists()) {
      data = userSnap.data();
    }

    const name = data.displayName || currentUser.displayName || "Account";

    const email = data.email || currentUser.email || "";

    const photoURL = data.photoURL || currentUser.photoURL || "";

    // Navbar
    if (navUsername) {
      navUsername.textContent = name;
    }

    setProfilePicture(navProfilePicture, photoURL);

    // Dropdown
    if (dropdownName) {
      dropdownName.textContent = name;
    }

    if (dropdownEmail) {
      dropdownEmail.textContent = email;
    }

    setProfilePicture(dropdownProfilePicture, photoURL);
  } catch (error) {
    console.error("Error loading current user:", error);

    const name = currentUser.displayName || "Account";

    const email = currentUser.email || "";

    if (navUsername) {
      navUsername.textContent = name;
    }

    if (dropdownName) {
      dropdownName.textContent = name;
    }

    if (dropdownEmail) {
      dropdownEmail.textContent = email;
    }

    setProfilePicture(navProfilePicture, currentUser.photoURL || "");

    setProfilePicture(dropdownProfilePicture, currentUser.photoURL || "");
  }
}

// --------------------------------------------------
// LOAD USER GROUPS
// --------------------------------------------------

async function loadUserGroups() {
  if (!groupsContent || !groupsGrid) {
    return;
  }

  groupsContent.style.display = "block";

  if (singleGroupContent) {
    singleGroupContent.style.display = "none";
  }

  try {
    const userRef = doc(db, "users", currentUser.uid);

    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      showNoGroups();
      return;
    }

    const userData = userSnap.data();

    const groupIds = Array.isArray(userData.groupIds) ? userData.groupIds : [];

    groupsGrid.innerHTML = "";

    if (groupIds.length === 0) {
      showNoGroups();
      return;
    }

    let loadedGroups = 0;

    for (const groupId of groupIds) {
      try {
        const groupRef = doc(db, "groups", groupId);

        const groupSnap = await getDoc(groupRef);

        if (!groupSnap.exists()) {
          continue;
        }

        const groupData = groupSnap.data();

        const membersSnapshot = await getDocs(
          collection(db, "groups", groupId, "members")
        );

        const memberCount = membersSnapshot.size;

        const card = document.createElement("div");

        card.className = "group-card";

        card.innerHTML = `
          <h2>
            ${escapeHTML(groupData.name || "Unnamed Group")}
          </h2>

          <div class="group-card-info">
            <div>
              Join Code:
              <span class="group-code-small">
                ${escapeHTML(groupData.joinCode || "------")}
              </span>
            </div>

            <div>
              ${memberCount}
              ${memberCount === 1 ? "member" : "members"}
            </div>
          </div>

          <a
            href="groups.html?id=${encodeURIComponent(groupId)}"
            class="group-card-button"
          >
            View Group
          </a>
        `;

        groupsGrid.appendChild(card);

        loadedGroups++;
      } catch (error) {
        console.error(`Error loading group ${groupId}:`, error);
      }
    }

    if (loadedGroups === 0) {
      showNoGroups();
    } else if (groupsEmpty) {
      groupsEmpty.style.display = "none";
    }
  } catch (error) {
    console.error("Error loading groups:", error);

    groupsGrid.innerHTML = "";

    if (groupsEmpty) {
      groupsEmpty.textContent = "There was an error loading your groups.";

      groupsEmpty.style.display = "block";
    }
  }
}

// --------------------------------------------------
// NO GROUPS
// --------------------------------------------------

function showNoGroups() {
  if (groupsGrid) {
    groupsGrid.innerHTML = "";
  }

  if (groupsEmpty) {
    groupsEmpty.textContent = "You are not in any groups yet.";

    groupsEmpty.style.display = "block";
  }
}

// --------------------------------------------------
// LOAD SINGLE GROUP
// --------------------------------------------------

async function loadSingleGroup(groupId) {
  if (groupsContent) {
    groupsContent.style.display = "none";
  }

  if (singleGroupContent) {
    singleGroupContent.style.display = "block";
  }

  try {
    // ----------------------------------------------
    // GET GROUP
    // ----------------------------------------------

    const groupRef = doc(db, "groups", groupId);

    const groupSnap = await getDoc(groupRef);

    if (!groupSnap.exists()) {
      showGroupError("Group not found.");

      return;
    }

    const groupData = groupSnap.data();

    // ----------------------------------------------
    // CHECK MEMBERSHIP
    // ----------------------------------------------

    const memberRef = doc(db, "groups", groupId, "members", currentUser.uid);

    const memberSnap = await getDoc(memberRef);

    if (!memberSnap.exists()) {
      showGroupError("You are not a member of this group.");

      return;
    }

    // ----------------------------------------------
    // GROUP HEADER
    // ----------------------------------------------

    if (selectedGroupHeader) {
      selectedGroupHeader.innerHTML = `
        <h1>
          ${escapeHTML(groupData.name || "Unnamed Group")}
        </h1>

        <div class="selected-group-code">
          Join Code:
          <strong>
            ${escapeHTML(groupData.joinCode || "------")}
          </strong>
        </div>
      `;
    }

    // ----------------------------------------------
    // GET MEMBERS
    // ----------------------------------------------

    const membersSnapshot = await getDocs(
      collection(db, "groups", groupId, "members")
    );

    if (groupMemberCount) {
      const count = membersSnapshot.size;

      groupMemberCount.textContent = `${count} ${
        count === 1 ? "member" : "members"
      }`;
    }

    // ----------------------------------------------
    // LOAD MEMBER DATA
    // ----------------------------------------------

    groupMembers = [];

    for (const memberDocument of membersSnapshot.docs) {
      try {
        const memberId = memberDocument.id;

        const userRef = doc(db, "users", memberId);

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          groupMembers.push({
            id: memberId,
            displayName: "Unnamed Player",
            photoURL: "",
            grade: "—",
            unit: "—",
            xp: 0,
            lessons: 0,
          });

          continue;
        }

        const userData = userSnap.data();

        groupMembers.push({
          id: memberId,

          displayName: userData.displayName || "Unnamed Player",

          photoURL: userData.photoURL || "",

          grade: getGrade(userData.gradeLevel),

          unit: getUnit(userData.gradeLevel),

          xp: numberValue(userData.xp),

          lessons: numberValue(userData.lessonsCompleted),
        });
      } catch (error) {
        console.error(`Error loading member ${memberDocument.id}:`, error);
      }
    }

    renderGroupLeaderboard();
  } catch (error) {
    console.error("Error loading group:", error);

    showGroupError("There was an error loading this group.");
  }
}

// --------------------------------------------------
// GROUP ERROR
// --------------------------------------------------

function showGroupError(message) {
  if (groupsContent) {
    groupsContent.style.display = "none";
  }

  if (singleGroupContent) {
    singleGroupContent.style.display = "block";
  }

  if (selectedGroupHeader) {
    selectedGroupHeader.innerHTML = `
      <h1>
        ${escapeHTML(message)}
      </h1>
    `;
  }

  if (groupMemberCount) {
    groupMemberCount.textContent = "";
  }

  if (groupLeaderboardBody) {
    groupLeaderboardBody.innerHTML = `
      <tr>
        <td colspan="6">
          ${escapeHTML(message)}
        </td>
      </tr>
    `;
  }
}

// --------------------------------------------------
// FILTER / SORT
// --------------------------------------------------

if (groupGradeFilter) {
  groupGradeFilter.addEventListener("change", renderGroupLeaderboard);
}

if (groupSort) {
  groupSort.addEventListener("change", renderGroupLeaderboard);
}

// --------------------------------------------------
// RENDER GROUP LEADERBOARD
// --------------------------------------------------

function renderGroupLeaderboard() {
  if (!groupLeaderboardBody) {
    return;
  }

  let members = [...groupMembers];

  // ----------------------------------------------
  // GRADE FILTER
  // ----------------------------------------------

  const selectedGrade = groupGradeFilter?.value || "all";

  if (selectedGrade !== "all") {
    members = members.filter((member) => member.grade === selectedGrade);
  }

  // ----------------------------------------------
  // SORT
  // ----------------------------------------------

  const sortBy = groupSort?.value || "xp";

  if (sortBy === "lessons") {
    members.sort(
      (a, b) =>
        b.lessons - a.lessons ||
        b.xp - a.xp ||
        a.displayName.localeCompare(b.displayName)
    );
  } else {
    members.sort(
      (a, b) =>
        b.xp - a.xp ||
        b.lessons - a.lessons ||
        a.displayName.localeCompare(b.displayName)
    );
  }

  // ----------------------------------------------
  // CLEAR TABLE
  // ----------------------------------------------

  groupLeaderboardBody.innerHTML = "";

  // ----------------------------------------------
  // EMPTY
  // ----------------------------------------------

  if (members.length === 0) {
    groupLeaderboardBody.innerHTML = `
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

  members.forEach((member, index) => {
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

    picture.alt = `${member.displayName}'s profile picture`;

    if (member.photoURL) {
      picture.src = member.photoURL;
    } else {
      picture.src = createDefaultProfilePicture();
    }

    picture.onerror = () => {
      picture.onerror = null;

      picture.src = createDefaultProfilePicture();
    };

    // Name
    const playerName = document.createElement("span");

    playerName.textContent = member.displayName;

    player.appendChild(picture);

    player.appendChild(playerName);

    // Grade
    const grade = document.createElement("td");

    grade.textContent = member.grade;

    // Unit
    const unit = document.createElement("td");

    unit.textContent = member.unit;

    // XP
    const xp = document.createElement("td");

    xp.textContent = member.xp.toLocaleString();

    // Lessons
    const lessons = document.createElement("td");

    lessons.textContent = member.lessons.toLocaleString();

    // Add cells
    row.appendChild(rank);

    row.appendChild(player);

    row.appendChild(grade);

    row.appendChild(unit);

    row.appendChild(xp);

    row.appendChild(lessons);

    groupLeaderboardBody.appendChild(row);
  });
}
