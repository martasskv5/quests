## ✅ To-Do List: Expanding the Quest App with Players and Clans

### 🔧 General Setup
- [x] Review the existing Angular application structure (Quests management).
- [x] Ensure Angular version 20 is being used.
- [x] Set up routing for new sections: `Players` and `Clans`.

---

### 🧙‍♂️ Players Section
- [x] Create a new `Players` module/component.
- [x] Display a list of all players.
- [x] Each player should have:
  - [x] Nickname
  - [x] Level
  - [x] Clan (if any)
  - [x] (Optional) Profile image
  - [x] List of their quests
- [x] Create a **Player Detail** page:
  - [x] Show all player info
  - [x] Link to related quests
  - [x] Link to related clan
- [x] Add functionality:
  - [x] "Add Player" button (default player or form)
  - [x] Delete player option

---

### 🛡️ Clans Section
- [x] Create a new `Clans` module/component.
- [x] Display a list of all clans.
- [x] Each clan should have:
  - [x] Name
  - [x] Description
  - [x] Capacity (max number of members)
  - [x] (Optional) Profile image
- [x] Create a **Clan Detail** page:
  - [x] Show clan info
  - [x] List of members
  - [x] Link to each member’s detail page
- [x] Add functionality:
  - [x] "Add Clan" button (default clan or form)
  - [x] Add/remove player from clan
  - [x] Delete clan option

---

### 🔁 Data Relationships & Consistency
- [x] Ensure players can belong to only one clan.
- [x] Ensure clan capacity is not exceeded.
- ~~[ ] Maintain consistency between quests, players, and clans.~~

---

### 16
- [x] Add new player form with validation.
- [x] Add new clan form with validation.
- [x] Add new quest form with validation.

---

### 17
- [x] Split player quests into "Completed" and "In Progress" sections.
- [x] Add ability to mark quests as completed or in progress for players.
- [x] ?Fix column order when changing quest status.

---

### 18
- [x] Create player level interface
- [x] Define levels based on experience points or completed quests.
- [ ] Update player to use xp instead of level directly.
- [ ] Implement level based on xp thresholds.
- [ ] Display player level in player details and lists.
- [ ] In player detail, show progress to next level.
- Slightly modified: this is in the `modules.ts` file instead `levels.ts`.

---

### 19
- [ ] Implement search functionality for players based on PlayerLevel.