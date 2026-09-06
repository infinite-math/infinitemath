<!DOCTYPE html>

<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

```
<title>Group - Infinite Math</title>

<link rel="stylesheet" href="style.css" />
```

  </head>

  <body>
    <nav class="navbar">
      <div class="navbar-left">
        <a href="home.html" class="logo">Infinite Math</a>
      </div>

```
  <div class="navbar-right">
    <a href="create-join-groups.html" class="back-button">← Groups</a>
  </div>
</nav>

<main class="group-page-container">
  <div class="group-page-card">
    <div class="group-heading">
      <div>
        <h1 id="groupName">Loading...</h1>

        <p id="groupCode">Loading group...</p>
      </div>

      <div class="group-member-count">
        <strong id="memberCount">-</strong>

        <span>members</span>
      </div>
    </div>

    <section class="leaderboard-section group-leaderboard-section">
      <div class="leaderboard-header">
        <div>
          <h2>Group Leaderboard</h2>

          <p>Compare progress with your group.</p>
        </div>

        <div class="leaderboard-controls">
          <div>
            <label for="groupSort">Sort by</label>

            <select id="groupSort">
              <option value="xp">XP</option>
              <option value="lessonsCompleted">
                Lessons Completed
              </option>
            </select>
          </div>

          <div>
            <label for="groupGrade">Grade</label>

            <select id="groupGrade">
              <option value="all">All Grades</option>
              <option value="K">Kindergarten</option>
              <option value="1">Grade 1</option>
              <option value="2">Grade 2</option>
              <option value="3">Grade 3</option>
              <option value="4">Grade 4</option>
              <option value="5">Grade 5</option>
              <option value="6">Grade 6</option>
              <option value="7">Grade 7</option>
              <option value="8">Grade 8</option>
              <option value="9">Grade 9</option>
              <option value="10">Grade 10</option>
              <option value="11">Grade 11</option>
              <option value="12">Grade 12</option>
            </select>
          </div>
        </div>
      </div>

      <div id="groupLeaderboard" class="leaderboard">
        Loading leaderboard...
      </div>
    </section>

    <section class="group-members-section">
      <h2>Group Members</h2>

      <p>Account IDs of everyone in this group.</p>

      <div id="groupMembersList">Loading members...</div>
    </section>
  </div>
</main>

<script type="module" src="group.js"></script>
```

  </body>
</html>
