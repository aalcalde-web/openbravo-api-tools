# Openbravo Tools Portal

Portal for internal tools and documentation projects.

## Structure

```
├── portal/                  # Portal landing page source
│   ├── index.html
│   ├── css/styles.css
│   └── js/
│       ├── app.js           # Renders project cards
│       └── projects.js      # Project registry (edit to add projects)
├── api-field-reference/     # Subproject: API Field Reference
├── .gitlab-ci.yml           # Assembles portal + subprojects for GitLab Pages
└── README.md
```

## Adding a new project

1. Place the project folder at the root (e.g. `my-new-tool/public/`)
2. Add an entry in `portal/js/projects.js`
3. Add a copy step in `.gitlab-ci.yml`

## Local preview

Open `portal/index.html` in a browser. For subproject links to work locally, serve from the repo root:

```bash
python3 -m http.server 8080
# Then open http://localhost:8080/portal/
```
