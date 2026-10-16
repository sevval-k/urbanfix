# 🏙️ UrbanFix — Smart Urban Issue Management System

**A map-based web application for reporting, visualizing, and analyzing urban infrastructure problems.**

UrbanFix is a smart urban issue management platform designed to help users report and manage problems such as potholes, damaged sidewalks, broken streetlights, and environmental pollution. By combining interactive maps, geospatial data, and visual analytics, the application provides a practical way to explore urban issues and understand where they occur.

The project was developed with a focus on modern web development and Geomatics Engineering, with a geospatial foundation that supports future integration with PostgreSQL/PostGIS and data science workflows.

<p align="center">
  <a href="https://urban-fix-pr.netlify.app/">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20UrbanFix-16a34a?style=for-the-badge&logo=netlify&logoColor=white" alt="Live Demo">
  </a>
  <a href="https://github.com/sevval-k/urbanfix">
    <img src="https://img.shields.io/badge/GitHub-Source%20Code-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repository">
  </a>
</p>

<p align="center">
  <strong>Explore the live application:</strong>
  <a href="https://urban-fix-pr.netlify.app/">urban-fix-pr.netlify.app</a>
</p>

---

## 📸 Application Preview

<p align="center">
  <img src="docs/screenshots/dashboard.png" width="90%" alt="UrbanFix Dashboard">
</p>

<p align="center">
  <em>Dashboard with issue statistics, category distribution, status overview, and recent reports.</em>
</p>

### Explore the Interface

<table>
  <tr>
    <td width="50%">
      <img src="docs/screenshots/map.png" alt="Interactive Issues Map" width="100%">
      <p align="center"><strong>Interactive Issues Map</strong></p>
    </td>
    <td width="50%">
      <img src="docs/screenshots/report-form.png" alt="Issue Reporting Form" width="100%">
      <p align="center"><strong>Issue Reporting</strong></p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="docs/screenshots/analysis.png" alt="Spatial Density Analysis" width="100%">
      <p align="center"><strong>Spatial Analysis</strong></p>
    </td>
    <td width="50%">
      <img src="docs/screenshots/mobile.png" alt="UrbanFix Mobile Interface" width="100%">
      <p align="center"><strong>Responsive Mobile Interface</strong></p>
    </td>
  </tr>
</table>

---

## ✨ Key Features

### 📊 Interactive Dashboard
- Displays total reports and counts of pending, investigating, resolved, and high-priority issues.
- Visualizes issue categories and status distributions.
- Shows recently submitted reports.
- Calculates statistics from the records stored in the application.

### 📍 Map-Based Issue Reporting
- Select a location by clicking or tapping an interactive map.
- Drag the location marker to refine the selected position.
- Use the browser's Geolocation API to detect the current location.
- Display location accuracy and handle denied permissions, unavailable locations, and timeout errors.
- Submit reports without requiring geolocation access.

### 🗺️ Issue Visualization
- Displays reported issues as markers on an interactive map.
- Colors markers by category, priority, or status.
- Provides a map legend with issue counts.
- Opens popups containing report details.
- Supports filtering to explore relevant issues.

### 📝 Issue Management
- Create, view, update, and delete reports.
- Validate form inputs.
- Confirm deletion before removing a report.
- Search reports by title or description.
- Filter by category, status, and priority.
- Sort reports by date or priority.

### 📈 Spatial Analysis
- Generates exact count tables for category versus status and category versus priority.
- Displays a grid-based density map showing where reports concentrate.
- Helps users explore the spatial distribution of reported urban problems.

### 💾 Data Management
- Persists records in browser LocalStorage.
- Handles damaged or invalid stored data safely.
- Clearly labels sample records and allows them to be removed.
- Exports records as GeoJSON.
- Generates a SQL export for a potential PostgreSQL/PostGIS migration.

### 🧪 Automated Testing
- Uses Vitest to test core application logic.
- Covers validation, filtering, statistics, storage loading, GeoJSON export, density calculations, and SQL generation.

### 📱 Responsive Design
- Supports desktop and mobile layouts.
- Provides interactive map controls and forms across screen sizes.

---

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| Vite | Development server and build tooling |
| JavaScript | Application logic |
| Tailwind CSS | Responsive styling |
| React Router | Client-side navigation |
| Leaflet & React Leaflet | Interactive maps |
| OpenStreetMap | Map tiles and geographic context |
| Recharts | Charts and data visualization |
| Browser Geolocation API | Current-location detection |
| LocalStorage | Client-side data persistence |
| Vitest | Automated testing |
| Netlify | Live application hosting |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or newer
- npm

### Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/sevval-k/urbanfix.git
cd urbanfix
npm install
```

### Run the Development Server

```bash
npm run dev
```

Open the local URL displayed in your terminal. Vite commonly uses `http://localhost:5173/`, but the actual port may differ depending on your configuration.

### Available Commands

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server |
| `npm test` | Runs automated tests |
| `npm run lint` | Checks code style |
| `npm run build` | Creates a production build in `dist/` |
| `npm run preview` | Previews the production build locally |

**Note:** Browser geolocation requires a secure context, such as HTTPS or `localhost`.

---

## 📂 Project Structure

```text
urbanfix/
├── src/
│   ├── components/   # Reusable UI, forms, maps, charts, and dialogs
│   ├── pages/        # Application pages
│   ├── context/      # Shared issue state and persistence
│   ├── hooks/        # Geolocation, reverse geocoding, and issue hooks
│   ├── utils/        # Validation, filtering, statistics, and exports
│   └── data/         # Sample records
├── docs/
│   ├── screenshots/  # Application screenshots
│   └── postgis-migration.md
├── package.json
└── README.md
```

Most core operations are implemented as reusable functions in `src/utils/`. This structure makes the application logic easier to maintain and test independently of the user interface.

---

## 🗺️ Geospatial Data and Database Migration

UrbanFix uses geographic coordinates to represent the locations of reported urban issues. Its record structure includes stable identifiers, ISO-formatted dates, and WGS 84 coordinates.

The application can export records as GeoJSON and generate a SQL script for creating a PostgreSQL/PostGIS table using:

```sql
geometry(Point, 4326)
```

This provides a starting point for future migration from browser-based storage to a spatial database.

See the [PostGIS migration documentation](docs/postgis-migration.md) for additional details.

---

## ⚠️ Current Limitations

UrbanFix is a functional prototype. The following limitations are important when evaluating the application.

- **Client-side storage:** Reports are stored in LocalStorage and are not shared across users, devices, or browsers. Browser storage can also be cleared.
- **Sample data:** Demonstration records are labelled as samples and can be removed from the Data page.
- **Density visualization:** The density map counts reports within square grid cells. It is a visualization, not a formal statistical hotspot analysis.
- **Geolocation accuracy:** Location accuracy depends on the browser and device. Users can manually adjust the selected map position.
- **Reverse geocoding:** The optional Nominatim integration is cached and rate-limited. The public service is intended for appropriate usage, not unrestricted high-volume traffic.
- **Marker overlap:** Reports with identical coordinates may overlap because marker clustering is not implemented.
- **Photo handling:** Photos are stored as links rather than uploaded files.
- **No backend:** The application does not currently have a server-side API or shared database.

---

## 🔮 Future Improvements

The following ideas are planned possibilities and are **not currently implemented**.

- **PostgreSQL/PostGIS integration:** Store and share reports through a spatial database.
- **User accounts:** Introduce authentication and role-based access.
- **Issue priority prediction:** Explore machine learning models that estimate priority from historical reports.
- **Advanced spatial analysis:** Add kernel density estimation, clustering, or statistical hotspot detection using a Python analytics backend.
- **Issue volume forecasting:** Estimate future report volumes when sufficient historical data becomes available.
- **Image classification:** Suggest issue categories based on uploaded photographs.
- **Photo uploads:** Support file uploads through object storage.

Any future AI feature would require a clearly defined problem, suitable data, and an appropriate evaluation method.

---

## 🧭 Project Goals

UrbanFix brings together several areas of practical development:

- Web application development
- Geographic information systems (GIS)
- Interactive mapping and spatial visualization
- Data management and export
- Automated testing
- Preparation for spatial database integration
- Potential future machine learning applications

The project demonstrates how a map-based application can organize and visualize urban infrastructure reports while providing a foundation for more advanced geospatial analysis.

---

## 🗺️ Data Attribution

Map tiles and geographic data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright).

Reverse geocoding uses the public [Nominatim service](https://nominatim.org/), subject to its usage policy.

---

## 👩‍💻 Author

**Şevval Köntek**

Developed as a web development training project with a focus on Geomatics Engineering, interactive mapping, and geospatial data applications.

- **Live Demo:** https://urban-fix-pr.netlify.app/
- **GitHub Repository:** https://github.com/sevval-k/urbanfix

---

<p align="center">
  <strong>UrbanFix — Making Urban Issues Visible, One Location at a Time.</strong>
</p>
