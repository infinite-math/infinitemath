import {
  auth,
  db,
  onAuthStateChanged,
  signOut,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  serverTimestamp,
  arrayUnion,
  writeBatch,
} from "./firebase-config.js";

let currentUser = null;

// -----------------------------
// ELEMENTS
// -----------------------------

const sidebarToggle = document.getElementById("sidebarToggle");

const sidebarOverlay = document.getElementById("sidebarOverlay");

const sidePanel = document.getElementById("sidePanel");

const groupsArrow = document.getElementById("groupsArrow");

const groupsSubmenu = document.getElementById("groupsSubmenu");

const accountButton = document.getElementById("accountButton");

const accountDropdown = document.getElementById("accountDropdown");

const signOutButton = document.getElementById("signOutButton");

const navProfilePicture = document.getElementById("navProfilePicture");

const navUsername = document.getElementById("navUsername");

const dropdownProfilePicture = document.getElementById(
  "dropdownProfilePicture"
);

const dropdownName = document.getElementById("dropdownName");

const dropdownEmail = document.getElementById("dropdownEmail");

const groupNameInput = document.getElementById("groupNameInput");

const createGroupButton = document.getElementById("createGroupButton");

const createMessage = document.getElementById("createMessage");

const groupCodeResult = document.getElementById("groupCodeResult");

const generatedGroupCode = document.getElementById("generatedGroupCode");

const newGroupLink = document.getElementById("newGroupLink");

const joinCodeInput = document.getElementById("joinCodeInput");

const joinGroupButton = document.getElementById("joinGroupButton");

const joinMessage = document.getElementById("joinMessage");

// -----------------------------
// SIDEBAR
// -----------------------------

sidebarToggle?.addEventListener("click", () => {
  sidePanel?.classList.toggle("open");
  sidebarOverlay?.classList.toggle("open");
});

sidebarOverlay?.addEventListener("click", () => {
  sidePanel?.classList.remove("open");
  sidebarOverlay?.classList.remove("open");
});

groupsArrow?.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();

  const open = groupsSubmenu?.classList.toggle("open");

  groupsSubmenu?.classList.toggle("show", open);

  groupsArrow.textContent = open ? "▴" : "▾";
});

// -----------------------------
// ACCOUNT
// -----------------------------

accountButton?.addEventListener("click", (event) => {
  event.stopPropagation();

  const open = accountDropdown?.classList.toggle("show");

  accountDropdown?.classList.toggle("open", open);
});

document.addEventListener("click", () => {
  accountDropdown?.classList.remove("show");

  accountDropdown?.classList.remove("open");
});

signOutButton?.addEventListener("click", async () => {
  try {
    await signOut(auth);

    window.location.href = "login.html";
  } catch (error) {
    console.error(error);
  }
});

// -----------------------------
// PROFILE
// -----------------------------

async function loadProfile(user) {
  try {
    const snapshot = await getDoc(doc(db, "users", user.uid));

    const data = snapshot.exists() ? snapshot.data() : {};

    const name = data.displayName || user.displayName || "Account";

    const email = data.email || user.email || "";

    const photo = data.photoURL || user.photoURL || "";

    navUsername.textContent = name;
    dropdownName.textContent = name;
    dropdownEmail.textContent = email;

    if (photo) {
      navProfilePicture.src = photo;
      dropdownProfilePicture.src = photo;
    }
  } catch (error) {
    console.error(error);
  }
}

// -----------------------------
// GROUP CODE
// -----------------------------

const CODE_CHARACTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateGroupCode() {
  let code = "";

  for (let i = 0; i < 6; i++) {
    const index = Math.floor(Math.random() * CODE_CHARACTERS.length);

    code += CODE_CHARACTERS[index];
  }

  return code;
}

async function getUniqueGroupCode() {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generateGroupCode();

    const groupQuery = query(
      collection(db, "groups"),
      where("joinCode", "==", code)
    );

    const snapshot = await getDocs(groupQuery);

    if (snapshot.empty) {
      return code;
    }
  }

  throw new Error("Could not generate a unique group code.");
}

// -----------------------------
// CREATE GROUP
// -----------------------------

createGroupButton?.addEventListener("click", async () => {
  if (!currentUser) {
    return;
  }

  const name = groupNameInput.value.trim();

  createMessage.textContent = "";
  groupCodeResult.style.display = "none";

  if (name.length < 2) {
    createMessage.textContent = "Group name must be at least 2 characters.";

    return;
  }

  if (name.length > 40) {
    createMessage.textContent =
      "Group name cannot be longer than 40 characters.";

    return;
  }

  createGroupButton.disabled = true;
  createGroupButton.textContent = "Creating...";

  try {
    const joinCode = await getUniqueGroupCode();

    const groupRef = doc(collection(db, "groups"));

    const memberRef = doc(
      db,
      "groups",
      groupRef.id,
      "members",
      currentUser.uid
    );

    const userRef = doc(db, "users", currentUser.uid);

    const batch = writeBatch(db);

    batch.set(groupRef, {
      name,
      ownerId: currentUser.uid,
      joinCode,
      createdAt: serverTimestamp(),
    });

    batch.set(memberRef, {
      role: "owner",
      joinedAt: serverTimestamp(),
    });

    batch.set(
      userRef,
      {
        groupIds: arrayUnion(groupRef.id),
      },
      {
        merge: true,
      }
    );

    await batch.commit();

    createMessage.textContent = "Group created successfully!";

    generatedGroupCode.textContent = joinCode;

    newGroupLink.href = `groups.html?id=${encodeURIComponent(groupRef.id)}`;

    groupCodeResult.style.display = "block";

    groupNameInput.value = "";
  } catch (error) {
    console.error("Create group error:", error);

    createMessage.textContent =
      "Could not create the group. Check your Firebase rules.";
  } finally {
    createGroupButton.disabled = false;

    createGroupButton.textContent = "Create Group";
  }
});

// -----------------------------
// JOIN GROUP
// -----------------------------

joinCodeInput?.addEventListener("input", () => {
  joinCodeInput.value = joinCodeInput.value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);
});

joinGroupButton?.addEventListener("click", async () => {
  if (!currentUser) {
    return;
  }

  const code = joinCodeInput.value.trim().toUpperCase();

  joinMessage.textContent = "";

  if (code.length !== 6) {
    joinMessage.textContent = "Group codes must be exactly 6 characters.";

    return;
  }

  joinGroupButton.disabled = true;
  joinGroupButton.textContent = "Joining...";

  try {
    const groupQuery = query(
      collection(db, "groups"),
      where("joinCode", "==", code)
    );

    const snapshot = await getDocs(groupQuery);

    if (snapshot.empty) {
      joinMessage.textContent = "No group was found with that code.";

      return;
    }

    const groupDocument = snapshot.docs[0];

    const groupId = groupDocument.id;

    const groupData = groupDocument.data();

    const memberRef = doc(db, "groups", groupId, "members", currentUser.uid);

    const memberSnapshot = await getDoc(memberRef);

    if (memberSnapshot.exists()) {
      joinMessage.textContent = "You are already in this group.";

      return;
    }

    const userRef = doc(db, "users", currentUser.uid);

    const batch = writeBatch(db);

    batch.set(memberRef, {
      role: "member",
      joinedAt: serverTimestamp(),
    });

    batch.set(
      userRef,
      {
        groupIds: arrayUnion(groupId),
      },
      {
        merge: true,
      }
    );

    await batch.commit();

    joinMessage.textContent = `You joined "${groupData.name}"!`;

    joinCodeInput.value = "";

    setTimeout(() => {
      window.location.href = `groups.html?id=${encodeURIComponent(groupId)}`;
    }, 700);
  } catch (error) {
    console.error("Join group error:", error);

    joinMessage.textContent =
      "Could not join the group. Check your Firebase rules.";
  } finally {
    joinGroupButton.disabled = false;

    joinGroupButton.textContent = "Join Group";
  }
});

// -----------------------------
// AUTH
// -----------------------------

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";

    return;
  }

  currentUser = user;

  await loadProfile(user);
});
