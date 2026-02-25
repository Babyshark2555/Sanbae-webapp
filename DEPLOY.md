Deployment (free, GitHub Pages)

This project uses Vite + React and can be deployed to GitHub Pages for free.

Steps:

1. Create a GitHub repository and add it as the `origin` remote:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

2. Ensure `package.json` has these scripts (already added):

- `predeploy`: builds the production `dist`
- `deploy`: publishes `dist` to `gh-pages` branch using `gh-pages` package

3. Install dependencies (already done locally):

```bash
npm install
```

4. Deploy once:

```bash
npm run deploy
```

This will build (`npm run build`) and publish the `dist` folder onto the `gh-pages` branch.

5. Enable GitHub Pages on the repository (if not automatic):

- Go to Settings → Pages → Source: select `gh-pages` branch
- The site will be available at `https://<your-username>.github.io/<repo-name>/`

Notes & alternatives:

- If you prefer automatic deploys on push, use GitHub Actions with the `actions/configure-pages` and `actions/upload-pages-artifact` / `actions/deploy-pages` workflow (GitHub Pages). I can scaffold the GitHub Actions workflow if you'd like.
- If you do not want your repo public, use a private repo and enable GitHub Pages from it (GitHub allows Pages on private repos in many plans).

If you want, I can:
- Add a GitHub Actions workflow (`.github/workflows/pages.yml`) to auto-deploy on push to `main`.
- Or I can deploy locally if you give me a repo remote URL and confirm pushing is OK.
