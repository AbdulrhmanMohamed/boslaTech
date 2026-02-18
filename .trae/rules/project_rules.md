Yes sir.

---

# 🔧 Enhanced Prompt Guidelines for Trae AI Project (Theme-Consistent & Premium Design)

### 🎨 Theme Compliance

- All components must strictly follow the **global theme system**.
- **Never use hardcoded colors** — use only **theme tokens**, **CSS variables**, or **design tokens**.
- Use semantic color naming: `--color-primary`, `--color-surface`, `--color-error`, etc.
- Avoid referencing specific shades (like `blue-500`, `#000`, `#fff`). Instead, reference role-based tokens (`--color-text`, `--color-background`).
- Maintain consistent **contrast** and **hierarchy** following accessibility standards (WCAG AA+).

---

### 🧱 File & Folder Structure

- Create an `errors/` folder at the project root.
- Inside it, maintain a file named `learning.md`.
- Every time an error occurs:
  1. Log the error message and full stack trace.
  2. Document the **cause**, **solution**, and **commit reference** in `learning.md`.
  3. Always check `learning.md` before debugging a new error to avoid repeating fixes.

Example entry:

```md
## [Date: 2025-10-09]

### Error:

TypeError: Cannot read property 'theme' of undefined

### Cause:

Theme context not provided to component.

### Solution:

Wrap component in `<ThemeProvider>`.

### Commit:

abc1234
```

---

### 🧩 Auto Mode (AI/Automation Design Rules)

- Auto mode must **always derive** from theme tokens.
- If a color, spacing, or typography value isn't in the theme — trigger a warning or reject generation.
- Follow best practices from **Material Design**, **Shopify Polaris**, and **Enterprise Design Systems**.
- Example:

```js
const buttonBg = theme.colors.primary;
const buttonText = theme.colors.onPrimary;
```

---

### 🧠 Design System Best Practices

- Use **Design Tokens** for all visual properties (color, typography, elevation, spacing, border-radius).
- Define clear roles for colors:
  - `color-primary`
  - `color-secondary`
  - `color-surface`
  - `color-on-surface`
  - `color-error`

- Use **consistent typography scale** and **spacing system**.
- For responsiveness, rely on theme breakpoints and spacing variables.

---

### ⚙️ Error Handling Workflow

- Always refer to `errors/learning.md` before starting a fix.
- Record new errors in the same format.
- Ensure that debugging never consumes unnecessary context by referring to prior resolutions.

---

### ✅ Linting / Code Rules

- Add ESLint rules to **disallow hardcoded colors**.
- Example rule:

```json
"no-restricted-syntax": [
  "error",
  {
    "selector": "Literal[value=/^#|rgb|hsl/]/",
    "message": "Do not use hardcoded color values; use theme tokens instead."
  }
]
```

- Use Prettier and Stylelint to enforce consistent formatting and variable usage.

---

### 🧭 Testing & Validation

- Validate color usage automatically with a token parser before build.
- Unit test each component to confirm it pulls from theme.
- Snapshot test theme changes to catch unintended overrides.

---

### 🪶 Premium Feel Guidelines

- Use subtle animations (opacity, scale, shadow) derived from the theme.
- Keep corner radius, shadows, and transitions token-based.
- Avoid visual noise — maintain minimalist, consistent UI.

---

### 🧾 Prompt Summary

**Core Principle:**

> Follow theme. No hardcoded colors. Log all errors systematically. Learn and reuse past fixes.

**Never override or hallucinate decisions — only act as instructed.**

** don't u ever run preview \***don't run Preview web Page**\* i will handle it myself **

** Show me all the progress and don't step untill u finish the todos **
** Answer yes sir before any response**

### 🚫 Action & Acknowledgment Protocol

- **Prioritize Action**: After planning or acknowledging a task, immediately proceed with the necessary actions (e.g., tool calls, code modifications).
- **Avoid Repetitive Acknowledgments**: Do not repeatedly acknowledge a task or update a todo list without performing concrete steps towards its completion.
- **Execution Over Redundancy**: Focus on executing the task. Only update the user or todo list when a tangible step has been completed or a significant change in status has occurred.
- **No Hallucinations**: Never claim a task is completed or an action has been taken if it has not. Be truthful about progress and any blockers.
