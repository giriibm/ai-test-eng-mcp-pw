# Environment Setup Prompt — Run This First on a New Machine

**Agent** : Default Copilot agent
**Run once** : After cloning the repo, before running any other prompt

---

## Purpose

This prompt sets up everything a new machine needs to run the AI QA E2E Agent pipelines:

- Verifies Node.js version
- Installs npm dependencies
- Downloads Playwright browsers
- Creates the `.env` file scaffold
- Creates the `.playwright-mcp/` MCP server config
- Verifies the full environment is ready

---

## Step 1 — Verify Node.js Version

Run the following and check the output:

```bash
node --version
npm --version
```

**Required**: Node.js v18 or higher.

If Node.js is missing or below v18, stop and ask the user to install it from https://nodejs.org before continuing.

---

## Step 2 — Install npm Dependencies

```bash
npm install
```

This installs `@playwright/test`, `playwright-bdd`, TypeScript types, and all other dependencies listed in `package.json`.

If this fails:
- Check that `package.json` exists in the workspace root
- Run `npm cache clean --force` then retry

---

## Step 3 — Download Playwright Browsers

```bash
npx playwright install --with-deps
```

This downloads Chromium, Firefox, and WebKit plus all OS-level dependencies (fonts, codecs, etc.) needed to run the browser tests.

Verify it worked:

```bash
npx playwright --version
```

Expected output: a version string like `Version 1.x.x`.

---

## Step 4 — Create the `.env` File

Check if `.env` already exists:

```bash
ls -la .env 2>/dev/null && echo "EXISTS" || echo "MISSING"
```

If **MISSING**, create the file:

```bash
cat > .env << 'EOF'
# MCP Server API key — required for the Playwright MCP Server agent (UI pipeline)
# Replace the placeholder with your actual key before running the UI prompts
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Optional overrides — leave blank to use the defaults from aut-config.md
# API_BASE_URL=
# API_USERNAME=
# API_PASSWORD=
# UI_BASE_URL=
# UI_USERNAME=
# UI_PASSWORD=
EOF
```

Then tell the user:
> `.env` has been created. **You must replace `your-anthropic-api-key-here` with your real API key before running the UI pipeline.** Open `.env` in the editor and update it now.

If **EXISTS**, read the file and check that `ANTHROPIC_API_KEY` is set to a non-placeholder value. If it still contains `your-anthropic-api-key-here`, warn the user to update it.

---

## Step 5 — Create the Playwright MCP Server Config

The Playwright MCP server config tells VS Code which browser tools the UI agent can use.

Check if the config already exists:

```bash
ls -la .vscode/mcp.json 2>/dev/null && echo "EXISTS" || echo "MISSING"
```

If **MISSING**, create it:

```bash
mkdir -p .vscode
cat > .vscode/mcp.json << 'EOF'
{
  "servers": {
    "playwright": {
      "type": "stdio",
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
EOF
```

If **EXISTS**, leave it unchanged.

---

## Step 6 — Verify VS Code Extensions

The following extensions must be installed in VS Code. These cannot be installed via the terminal — guide the user to do it manually if they are missing:

| Extension ID | Name | Required for |
|---|---|---|
| `GitHub.copilot-chat` | GitHub Copilot Chat | Running all prompt files in an agent |
| `ms-playwright.playwright` | Playwright Test for VS Code | Playwright MCP server + running tests from the editor |

To check if they are installed, run:

```bash
code --list-extensions | grep -E "GitHub.copilot-chat|ms-playwright.playwright"
```

If either is missing from the output, tell the user:
> Open VS Code → Extensions (Cmd+Shift+X) → search for the extension name → Install.

---

## Step 7 — Final Verification

Run all checks and report the result for each:

```bash
# 1. Node.js version
node --version

# 2. Playwright version
npx playwright --version

# 3. Key dependencies installed
ls node_modules/@playwright/test > /dev/null 2>&1 && echo "PASS: @playwright/test" || echo "FAIL: @playwright/test missing"
ls node_modules/playwright-bdd > /dev/null 2>&1 && echo "PASS: playwright-bdd" || echo "FAIL: playwright-bdd missing"

# 4. .env exists
ls .env > /dev/null 2>&1 && echo "PASS: .env exists" || echo "FAIL: .env missing"

# 5. MCP config exists
ls .vscode/mcp.json > /dev/null 2>&1 && echo "PASS: .vscode/mcp.json exists" || echo "FAIL: .vscode/mcp.json missing"
```

Report the results in a table:

| Check | Status |
|---|---|
| Node.js v18+ | PASS / FAIL |
| Playwright installed | PASS / FAIL |
| @playwright/test module | PASS / FAIL |
| playwright-bdd module | PASS / FAIL |
| .env file | PASS / FAIL |
| .vscode/mcp.json | PASS / FAIL |

If **all checks pass**, tell the user:

> Environment setup is complete. You are ready to run the prompts.
>
> **Next step**: Open `util/prompts/aut-config.md`, set `mode: demo` or `mode: full` in Section 6, then open your first prompt file in the Copilot agent.

If **any check fails**, fix the failure before declaring the setup complete.

---

## Prompt Execution Order (after setup)

| Step | Prompt file | Agent |
|---|---|---|
| 0 (this file) | `util/prompts/00-setup-environment.md` | Default Copilot agent |
| API pipeline | `util/prompts/api-test-automation.md` | Default Copilot agent |
| BDD pipeline | `util/prompts/bdd-smoke-test-automation.md` | Default Copilot agent |
| UI — Step 1 | `util/prompts/ui-step1-manual-test-cases.md` | Playwright MCP Server agent |
| UI — Step 2 | `util/prompts/ui-step2-test-plan.md` | Playwright Test Planner agent |
| UI — Step 3 | `util/prompts/ui-step3-exploratory-testing.md` | Playwright MCP Server agent |
| UI — Step 4 | `util/prompts/ui-step4-test-generation.md` | playwright-test-generator agent |
| UI — Step 5 | `util/prompts/ui-step5-self-heal-report.md` | playwright-test-healer agent |
