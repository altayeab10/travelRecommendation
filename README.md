# TravelBloom

TravelBloom is a responsive travel-discovery demo created by Altayeab. It helps curious travelers find destination inspiration: search for a country or city, or browse recommendations for beaches, mosques, and cities.

**Live demo:** [altayeab10.github.io/travelRecommendation](https://altayeab10.github.io/travelRecommendation/)

## Features

- Responsive layouts for desktop, tablet, and mobile screens.
- Search destination recommendations by category, country, city, name, or description.
- Browse beach, mosque, and country recommendations.
- About and Contact pages that share the same visual design.
- Contact form that prepares an email to the project owner using the visitor's email app.
- Accessible page landmarks, labels, and status messages for search and contact interactions.

## Built with

- HTML5
- CSS3, including responsive media queries
- Vanilla JavaScript
- JSON for destination data
- Font Awesome icons and Google Fonts

## Run locally

The recommendation data is loaded with `fetch`, so serve the files over HTTP instead of opening `index.html` directly.

### Visual Studio Code

1. Open the project folder in Visual Studio Code.
2. Install the **Live Server** extension if it is not already installed.
3. Right-click `index.html` and choose **Open with Live Server**.

### Node.js

From the project folder, run:

```bash
npx serve .
```

Open the local URL shown in the terminal.

## Project files

| File | Purpose |
| --- | --- |
| `index.html` | Home page and destination search interface |
| `about.html` | Project information and creator introduction |
| `contact.html` | Contact form that opens a pre-filled email |
| `style.css` | Shared styles, responsive layouts, and mobile navigation presentation |
| `travel_recommendation.js` | Destination search, JSON loading, and result rendering |
| `travel_recommendation_api.json` | Destination, city, beach, and mosque recommendation data |

## How the code works

### Destination search

1. `index.html` provides the search form, popular-category buttons, and an empty results area.
2. `travel_recommendation.js` listens for form submissions and category-button clicks. Both use the same `performSearch()` flow.
3. `loadTravelData()` fetches `travel_recommendation_api.json` the first time and reuses the parsed data for later searches.
4. `findDestinations()` normalizes the query, handles category shortcuts, then searches country, city, and place names or descriptions.
5. `displayResults()` updates the live results area. `createDestinationCard()` builds each result with DOM methods and text content.

Category shortcuts are `beaches`, `mosques`, and `countries`. Searching for a country returns its cities; searching by city or place can match names and descriptions.

### Recommendation data structure

The JSON file has three top-level categories: `countries`, `beaches`, and `mosques`. Countries contain a `cities` array; every displayed place has a `name`, `imageUrl`, and `description`.

```json
{
  "name": "Example destination",
  "imageUrl": "https://example.com/destination.jpg",
  "description": "A short description of the destination."
}
```

Add a place to the appropriate category in `travel_recommendation_api.json`. If introducing a new searchable category, update both its shortcut and the matching-place search in `findDestinations()` in `travel_recommendation.js`.

### Responsive layout

`style.css` contains shared components and three responsive breakpoints:

- At `900px`, navigation spacing tightens, result cards become two columns, and the contact layout narrows.
- At `680px`, navigation becomes a collapsible menu, content grids stack, search controls wrap, and the destination grid becomes one column.
- At `380px`, compact-phone spacing and typography are adjusted further.

The mobile menu button in each HTML page toggles the `is-open` class on the navigation and updates its `aria-expanded` state. Contact form fields use a larger mobile text size to prevent browsers from zooming when a field receives focus.

### Contact form behavior

The form validates required name, email, and message fields in the browser. On submission, `contact.html` builds a `mailto:` link with the form values encoded in its subject and body. This opens the visitor's configured email app; it does not send data to a server.

## Update recommendation data

Edit `travel_recommendation_api.json` to add or update places. Each recommendation includes a name, image URL, and description. Keep category names in sync with the search logic in `travel_recommendation.js`.

## Contact form note

The contact form uses a `mailto:` link. It opens the visitor's configured email app with a prepared message addressed to `ialtayeab@gmail.com`; the visitor must send the email themselves. The form does not send or store messages on a server.

## Deployment

The site is a static project and can be hosted with GitHub Pages. Configure Pages to deploy from the `main` branch and the repository root, where `index.html` and `style.css` are located.

## Future improvements

This is a demo project designed to be expanded with more destinations, filters, richer trip-planning features, or a server-backed contact form.
