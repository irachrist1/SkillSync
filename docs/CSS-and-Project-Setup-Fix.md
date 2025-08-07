## SkillSync AI — CSS Loading Fix and Project Cleanup

### Summary
Content rendered without styling because Tailwind was misconfigured (v4-style PostCSS with a v3-style Tailwind setup). We aligned Tailwind to v3, corrected PostCSS, fixed Next.js metadata warnings, upgraded Next to a patched version, and cleaned the workspace so dependencies live only under `skillsync-ai/`.

### Root Cause
- Tailwind mismatch: `@tailwindcss/postcss` (v4 plugin) was used while the project had a conventional `tailwind.config.js` (v3 style). This prevented Tailwind from generating CSS.

### Code Changes
- `skillsync-ai/postcss.config.js`: Changed plugins from `@tailwindcss/postcss` to `tailwindcss`.
- `skillsync-ai/package.json`: Pinned `tailwindcss` to v3 (^3.4.10), removed `@tailwindcss/postcss`, upgraded `next` to 14.2.31, upgraded `eslint-config-next` to 14.2.31.
- `skillsync-ai/src/app/layout.tsx`: Added `metadataBase` and moved `viewport` to a dedicated export.

### Commands Used (Core)
- Change directory to app folder and reinstall cleanly on Windows.
- Remove `node_modules`, `.next`, and lockfile, then reinstall and start dev server.

### Security/Audit
- npm audit flagged critical advisories in older Next. Upgraded to `next@14.2.31`. After a clean reinstall, npm audit reported 0 vulnerabilities.

### Windows EBUSY Lock Fix (if needed)
- Stop any running node processes, free ports if needed, then run the clean reinstall steps again.

### Repository Structure Cleanup
- Keep all Node dependencies only in `skillsync-ai/`.
- Remove root-level `node_modules`, `package.json`, and `package-lock.json` if they appear inadvertently.
- Add a root `.gitignore` to ignore `node_modules`, `.next`, and build output.

### Verification
- Dev server starts cleanly on `http://localhost:3000`.
- UI styling applied (Tailwind classes working).
- No viewport/metadata warnings.
- npm audit shows 0 vulnerabilities.

### Files Touched
- `skillsync-ai/postcss.config.js`
- `skillsync-ai/package.json`
- `skillsync-ai/src/app/layout.tsx`

### Notes
- Set `NEXT_PUBLIC_APP_URL` in `skillsync-ai/.env.local` (e.g., `http://localhost:3000`) so `metadataBase` does not fall back to localhost in production.

