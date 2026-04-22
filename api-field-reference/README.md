# API Field Reference

Interactive field reference for the External Orders and External Discounts APIs.

## Features

- Sidebar navigation between Orders and Discounts APIs
- Expandable/collapsible field hierarchy
- Multi-select severity filter (BUG, ERROR, MEJORABLE, OK)
- Endpoint and section filters
- Export filtered results to CSV or PDF

## Structure

```
├── .gitlab-ci.yml      # GitLab Pages deployment
├── generate.py         # Generates public/js/data.js from CSVs
├── data/               # Source CSV files
│   ├── EXTERNAL_ORDERS_API_fields.csv
│   └── EXTERNAL_DISCOUNTS_API_fields.csv
└── public/             # Deployed to GitLab Pages
    ├── index.html
    ├── css/styles.css
    └── js/
        ├── app.js
        ├── data.js     # Generated — do not edit manually
        ├── export.js
        ├── filters.js
        └── renderer.js
```

## Regenerating data

After modifying the CSV files, run:

```bash
python3 generate.py
```

This regenerates `public/js/data.js`. Commit and push to deploy.
