# TravelBloom

TravelBloom is a responsive travel-discovery demo that helps curious travelers find destination inspiration. Search for a country or city, or browse recommendations for beaches, mosques, and cities.

**Live demo:** [altayeab10.github.io/travelRecommendation](https://altayeab10.github.io/travelRecommendation/)

## Features

- Responsive layouts for desktop, tablet, and mobile screens.
- Search destination recommendations by category, country, city, name, or description.
- Browse beach, mosque, and country recommendations.
- About and Contact pages that share the same visual design.
- Contact form that prepares an email to the project owner using the visitor's email app.

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

## Update recommendation data

Edit `travel_recommendation_api.json` to add or update places. Each recommendation includes a name, image URL, and description. Keep category names in sync with the search logic in `travel_recommendation.js`.

## Contact form note

The contact form uses a `mailto:` link. It opens the visitor's configured email app with a prepared message addressed to `ialtayeab@gmail.com`; the visitor must send the email themselves. The form does not send or store messages on a server.

## Deployment

The site is a static project and can be hosted with GitHub Pages. Configure Pages to deploy from the `main` branch and the repository root, where `index.html` and `style.css` are located.

## Future improvements

This is a demo project designed to be expanded with more destinations, filters, richer trip-planning features, or a server-backed contact form.
