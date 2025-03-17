# Tortuga Liquors - SEO Landing Pages

A streamlined system for creating and maintaining SEO-optimized landing pages with affiliate links, hosted on GitHub Pages.

## System Overview

This project uses a component-based architecture to make maintaining multiple landing pages as simple as possible. Key features:

- **Centralized Components**: Navbar and footer are maintained in single files
- **Shared Stylesheet**: All styling is in one CSS file for consistency
- **Component Include System**: Simple JavaScript to dynamically load shared components
- **Content Refresh System**: Scripts to help refresh content with GitHub Copilot
- **Page Generator**: Utility to create new pages from a template

## File Structure

```
tortuga-liquors/
│
├── index.html                 # Homepage
├── css/
│   └── styles.css             # Central stylesheet
│
├── js/
│   ├── include.js             # Component include system
│   ├── create-page.js         # Script to generate new pages
│   └── content-refresher.js   # Script to refresh content
│
├── components/
│   ├── navbar.html            # Shared navigation component
│   └── footer.html            # Shared footer component
│
├── template.html              # Template for new pages
│
├── punta-santos.html          # Product landing pages
├── sentia.html

```

## How It Works

### 1. Component System

The system uses a simple component include mechanism:

```html
<div data-include="components/navbar.html"></div>
```

The `include.js` script loads these components when the page loads, reducing duplication and making site-wide changes simple.

### 2. Content Structure

Each page follows a consistent structure with clearly marked sections:

- `article-intro`: Introduction content
- `article-mid`: Main content section
- `article-close`: Call-to-action section
- `adspace-1` & `adspace-2`: Affiliate product sections

### 3. Content Refreshing

The content refresher script:

1. Finds all HTML pages that need refreshing
2. Extracts content from the marked article sections
3. Opens a temporary file with instructions for GitHub Copilot
4. Allows you to accept Copilot's suggested rewrites
5. Updates the original HTML files with the refreshed content

### 4. Creating New Pages

To create a new product page:

1. Run `node js/create-page.js`
2. Answer the prompts for page title, description, etc.
3. The script will generate a new HTML file based on the template
4. Add product-specific content and affiliate links

## How to Use

### Initial Setup

1. Clone this repository
2. Update `components/navbar.html` and `components/footer.html` with your site structure
3. Modify `css/styles.css` with your branding

### Creating New Pages

```bash
node js/create-page.js
```

Follow the prompts to create a new product page.

### Refreshing Content

```bash
node js/content-refresher.js
```

Choose which pages to refresh, then review and accept the GitHub Copilot suggestions for each section.

## Best Practices

- **Maintain Keywords**: When refreshing content, keep important keywords for SEO
- **Consistent Structure**: Don't modify the basic HTML structure of pages
- **Regular Updates**: Refresh content every 60-90 days to avoid staleness
- **Track Performance**: Monitor which pages need SEO improvements
- **Verify Links**: Always check that affiliate links remain valid after updates

## GitHub Pages Deployment

This project is designed to be deployed directly to GitHub Pages:

1. Push changes to your repository
2. Enable GitHub Pages in repository settings
3. GitHub will automatically build and serve your site
