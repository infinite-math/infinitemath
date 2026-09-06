import {
  auth,
  db,
  onAuthStateChanged,
  signOut,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "./firebase-config.js";

// ========================================
// ELEMENTS
// ========================================

const profilePicture = document.getElementById("profilePicture");

const profilePictureInput = document.getElementById("profilePictureInput");

const displayNameInput = document.getElementById("displayNameInput");

const saveNameButton = document.getElementById("saveNameButton");

const emailInput = document.getElementById("emailInput");

const providerInfo = document.getElementById("providerInfo");

const uidInfo = document.getElementById("uidInfo");

const statusMessage = document.getElementById("statusMessage");

const signOutButton = document.getElementById("signOutButton");

const mathLevelDisplay = document.getElementById("mathLevelDisplay");

// Navbar/account dropdown

const accountButton = document.getElementById("accountButton");

const accountDropdown = document.getElementById("accountDropdown");

const navProfilePicture = document.getElementById("navProfilePicture");

const navUsername = document.getElementById("navUsername");

const dropdownProfilePicture = document.getElementById(
  "dropdownProfilePicture"
);

const dropdownName = document.getElementById("dropdownName");

const dropdownEmail = document.getElementById("dropdownEmail");

// ========================================
// STATE
// ========================================

let currentUser = null;

// ========================================
// HELPERS
// ========================================

function formatProvider(providerId) {
  const names = {
    "google.com": "Google",
    password: "Email/Password",
    "facebook.com": "Facebook",
    "github.com": "GitHub",
  };

  return names[providerId] || providerId;
}

// ========================================
// FORMAT MATH LEVEL
// ========================================

function formatMathLevel(value) {
  if (!value || typeof value !== "string") {
    return "Not completed";
  }

  const parts = value.split(".");

  if (parts.length !== 2) {
    return value;
  }

  const grade = parts[0];
  const unit = parts[1];

  let gradeName;

  if (grade === "K") {
    gradeName = "Kindergarten";
  } else {
    const number = Number(grade);

    if (!Number.isInteger(number)) {
      return value;
    }

    if (number === 1) {
      gradeName = "1st Grade";
    } else if (number === 2) {
      gradeName = "2nd Grade";
    } else if (number === 3) {
      gradeName = "3rd Grade";
    } else {
      gradeName = `${number}th Grade`;
    }
  }

  return `${gradeName} — Unit ${unit}`;
}

// ========================================
// COMPRESS IMAGE
// ========================================

function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (event) {
      const image = new Image();

      image.onload = function () {
        const canvas = document.createElement("canvas");

        const MAX_SIZE = 256;

        let width = image.width;
        let height = image.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);

            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);

            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        context.drawImage(image, 0, 0, width, height);

        const result = canvas.toDataURL("image/jpeg", 0.7);

        resolve(result);
      };

      image.onerror = function () {
        reject(new Error("Could not load image."));
      };

      image.src = event.target.result;
    };

    reader.onerror = function () {
      reject(new Error("Could not read image."));
    };

    reader.readAsDataURL(file);
  });
}

// ========================================
// ACCOUNT DROPDOWN
// ========================================

if (accountButton && accountDropdown) {
  accountButton.addEventListener("click", function (event) {
    event.stopPropagation();

    accountDropdown.classList.toggle("open");
  });

  accountDropdown.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  document.addEventListener("click", function () {
    accountDropdown.classList.remove("open");
  });
}

// ========================================
// AUTH
// ========================================

onAuthStateChanged(auth, async function (user) {
  if (!user) {
    window.location.href = "login.html";

    return;
  }

  currentUser = user;

  console.log("Account page user:", user.uid);

  const userRef = doc(db, "users", user.uid);

  try {
    const snapshot = await getDoc(userRef);

    // ========================================
    // CREATE USER DOCUMENT
    // ========================================

    if (!snapshot.exists()) {
      console.log("Creating Firestore user document...");

      await setDoc(userRef, {
        displayName: user.displayName || "",

        email: user.email || "",

        photoURL: user.photoURL || "",

        gradeLevel: "",

        createdAt: serverTimestamp(),

        updatedAt: serverTimestamp(),
      });

      console.log("Firestore user document created.");

      displayNameInput.value = user.displayName || "";

      emailInput.value = user.email || "";

      if (user.photoURL) {
        profilePicture.src = user.photoURL;

        if (navProfilePicture) {
          navProfilePicture.src = user.photoURL;
        }

        if (dropdownProfilePicture) {
          dropdownProfilePicture.src = user.photoURL;
        }
      }

      // New account has no diagnostic result yet.
      mathLevelDisplay.textContent = "Not completed";
    } else {
      // ========================================
      // LOAD EXISTING DOCUMENT
      // ========================================

      const data = snapshot.data();

      displayNameInput.value = data.displayName || user.displayName || "";

      emailInput.value = user.email || "";

      // ========================================
      // LOAD GRADE LEVEL
      // ========================================

      mathLevelDisplay.textContent = formatMathLevel(data.gradeLevel || "");

      // ========================================
      // LOAD PROFILE PICTURE
      // ========================================

      const photo = data.photoURL || user.photoURL;

      if (photo) {
        profilePicture.src = photo;

        if (navProfilePicture) {
          navProfilePicture.src = photo;
        }

        if (dropdownProfilePicture) {
          dropdownProfilePicture.src = photo;
        }
      }

      // ========================================
      // LOAD NAVBAR NAME
      // ========================================

      const name = data.displayName || user.displayName || "Account";

      if (navUsername) {
        navUsername.textContent = name;
      }

      if (dropdownName) {
        dropdownName.textContent = name;
      }

      if (dropdownEmail) {
        dropdownEmail.textContent = user.email || "";
      }
    }

    // ========================================
    // ACCOUNT INFO
    // ========================================

    providerInfo.textContent = user.providerData.length
      ? formatProvider(user.providerData[0].providerId)
      : "Google";

    uidInfo.textContent = user.uid;

    // Make sure navbar data is populated
    // even when a new Firestore document
    // was just created.

    if (navUsername) {
      navUsername.textContent = user.displayName || "Account";
    }

    if (dropdownName) {
      dropdownName.textContent = user.displayName || "Account";
    }

    if (dropdownEmail) {
      dropdownEmail.textContent = user.email || "";
    }

    if (user.photoURL && navProfilePicture) {
      navProfilePicture.src = user.photoURL;
    }

    if (user.photoURL && dropdownProfilePicture) {
      dropdownProfilePicture.src = user.photoURL;
    }
  } catch (error) {
    console.error("Firestore error:", error);

    statusMessage.textContent = "Could not load your account: " + error.message;
  }
});

// ========================================
// PROFILE PICTURE
// ========================================

profilePictureInput.addEventListener("change", async function (event) {
  const file = event.target.files[0];

  if (!file || !currentUser) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    statusMessage.textContent = "Please select an image.";

    return;
  }

  statusMessage.textContent = "Saving profile picture...";

  try {
    const compressed = await compressImage(file);

    // Keep well below Firestore's
    // 1 MiB document limit.

    if (compressed.length > 700000) {
      statusMessage.textContent =
        "The image is still too large. Please choose another image.";

      return;
    }

    const userRef = doc(db, "users", currentUser.uid);

    await setDoc(
      userRef,
      {
        photoURL: compressed,

        updatedAt: serverTimestamp(),
      },
      {
        merge: true,
      }
    );

    // Update main profile picture

    profilePicture.src = compressed;

    // Update navbar picture

    if (navProfilePicture) {
      navProfilePicture.src = compressed;
    }

    // Update dropdown picture

    if (dropdownProfilePicture) {
      dropdownProfilePicture.src = compressed;
    }

    statusMessage.textContent = "Profile picture saved!";

    console.log("Profile picture saved to Firestore.");
  } catch (error) {
    console.error("PFP save error:", error);

    statusMessage.textContent =
      "Could not save profile picture: " + error.message;
  }
});

// ========================================
// SAVE NAME
// ========================================

saveNameButton.addEventListener("click", async function () {
  if (!currentUser) {
    return;
  }

  const name = displayNameInput.value.trim();

  if (!name) {
    statusMessage.textContent = "Please enter a name.";

    return;
  }

  statusMessage.textContent = "Saving name...";

  try {
    const userRef = doc(db, "users", currentUser.uid);

    await setDoc(
      userRef,
      {
        displayName: name,

        updatedAt: serverTimestamp(),
      },
      {
        merge: true,
      }
    );

    // Update navbar name

    if (navUsername) {
      navUsername.textContent = name;
    }

    // Update dropdown name

    if (dropdownName) {
      dropdownName.textContent = name;
    }

    statusMessage.textContent = "Name saved!";
  } catch (error) {
    console.error("Name save error:", error);

    statusMessage.textContent = "Could not save name: " + error.message;
  }
});

// ========================================
// SIGN OUT
// ========================================

signOutButton.addEventListener("click", async function () {
  try {
    await signOut(auth);

    window.location.href = "login.html";
  } catch (error) {
    console.error("Sign out error:", error);
  }
});
