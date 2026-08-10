# UI Guidelines

## Design Philosophy

The portfolio follows a **Modern Minimal** design language that emphasizes clarity, professionalism, and content-first presentation.

The public website is designed to highlight projects, experience, and technical expertise with minimal distractions, while the admin dashboard prioritizes usability and efficiency for content management.

The overall experience should feel:

- Clean
- Modern
- Fast
- Professional
- Developer-oriented
- Accessible
- Content-focused

Avoid excessive animations, heavy gradients, or unnecessary decorative elements.

---

# Typography

## Font Families

Display & Headings
- Inter

Body Text
- Open Sans

Code Snippets
- JetBrains Mono

## Font Scale

Hero Title
- 56px
- Bold (700)

Section Title
- 36px
- Bold (700)

Card Title
- 24px
- SemiBold (600)

Body
- 16px
- Regular (400)

Caption
- 14px

Small Labels
- 12px

Use generous line-height for readability.

---

# Color System

## Light Theme

Primary
#0C0C09

Secondary
#312C85

Accent
#4F46E5

Background
#FFFFFF

Surface
#F8F8F6

Border
#E5E5E5

Text Primary
#111111

Text Secondary
#6B7280

Success
#16A34A

Warning
#D97706

Danger
#DC2626

---

## Dark Theme

Background
#09090B

Surface
#18181B

Border
#27272A

Text Primary
#FAFAFA

Text Secondary
#A1A1AA

Primary Accent
#6366F1

---

Use semantic color tokens instead of raw hex values whenever possible.

Example:

primary

secondary

success

danger

surface

background

text-primary

text-secondary

border

---

# Spacing System

Use an 8px spacing system.

Available spacing:

4
8
12
16
24
32
40
48
64
96

Avoid arbitrary spacing values.

---

# Border Radius

Small
8px

Medium
12px

Large
16px

Extra Large
24px

Cards use rounded-xl.

Buttons use rounded-lg.

---

# Shadows

Use subtle elevation.

Level 1

Small shadow for cards.

Level 2

Hover elevation.

Avoid heavy shadows.

---

# Layout

Maximum Content Width

1280px

Content Width

1024px

Section Padding

80px Desktop

48px Tablet

32px Mobile

Grid

12-column responsive grid

---

# Icons

Use Lucide React.

Icons should be:

20px
24px
32px

Avoid filled icon styles.

---

# Components

## Public Website

Hero

About

Skills

Tech Stack

Experience Timeline

Featured Projects

Project Gallery

Contact

Footer

---

## Dashboard

Sidebar

Top Navigation

Cards

Tables

Forms

Image Upload

Dialogs

Toast Notifications

Pagination

Search

Empty States

Loading Skeletons

Confirmation Dialog

---

# Cards

Portfolio cards should include:

Thumbnail

Title

Short Description

Technology Tags

GitHub Button

Live Demo Button

Featured Badge (optional)

Hover animation:

- Slight scale
- Shadow elevation
- Image zoom

---

# Buttons

Primary

Solid

Secondary

Outline

Ghost

Icon Button

Loading Button

Danger Button

All buttons must have:

Hover

Focus

Disabled

Loading

States.

---

# Forms

Use:

React Hook Form

Zod Validation

Clear validation messages

Inline errors

Loading state

Toast notification after submit

---

# Animations

Use Framer Motion sparingly.

Allowed animations:

Fade In

Slide Up

Scale

Image Zoom

Stagger Children

Duration:

150–300ms

Respect prefers-reduced-motion.

Avoid:

Parallax

Continuous floating

Long animations

---

# Responsive Design

Desktop

≥1280px

Laptop

1024px

Tablet

768px

Mobile

390px+

Every page must work without horizontal scrolling.

---

# Accessibility

Target WCAG 2.2 AA.

Requirements:

Keyboard navigation

Visible focus ring

ARIA labels

Proper heading hierarchy

Minimum color contrast

Accessible forms

Reduced motion support

Alt text for every image

---

# Performance

Target Lighthouse Score:

Performance ≥95

Accessibility ≥100

Best Practices ≥100

SEO ≥100

Optimize:

Images

Fonts

Bundle size

Lazy loading

Code splitting

Server Components where possible.

---

# Design Principles

Content First

Whitespace over decoration

Consistency over creativity

Accessibility over aesthetics

Reusable components

Responsive by default

Minimal but memorable

Every component should have a clear purpose.

# Public Portfolio Experience

## Design Direction

The public portfolio uses a **Modern Minimal Editorial** visual direction.

The design combines:

- Minimal and clean foundations
- Bold editorial typography
- Strong visual hierarchy
- Large personal introduction
- Content-driven storytelling
- Subtle decorative elements
- Asymmetric layouts
- Generous whitespace
- Smooth scroll-based interactions

The website should feel like a combination of:

- Personal portfolio
- Developer profile
- Project showcase
- Professional resume

The visual language must remain consistent with the existing Minimal Design System.

Do not introduce a completely different visual language.

---

# Public Website Architecture

The public website is a **single-page portfolio**.

The main route `/` contains:

1. Navigation
2. Hero
3. Marquee / Technology Strip
4. About
5. Skills
6. Experience
7. Portfolio
8. Contact
9. Footer

Sections must be navigable using anchor links.

Example:

`/#about`

`/#skills`

`/#experience`

`/#portfolio`

`/#contact`

Do not create separate public pages for these sections.

---

# Detail Pages

Only Portfolio and Experience have dedicated detail pages.

Portfolio:

`/portfolio/[id]`

Experience:

`/experience/[id]`

The detail pages must reuse the same visual system as the main portfolio.

They should feel like an extension of the main website rather than a completely different application.

---

# Navigation

## Desktop

Use a centered or compact horizontal navigation.

Navigation items:

- Home
- About
- Skills
- Experience
- Portfolio
- Contact

Include a primary CTA:

`Hire Me`

The CTA should navigate to:

`/#contact`

## Mobile

Use a compact header with:

- Logo / Name
- Menu button
- Full-screen or dropdown navigation

Navigation must close after selecting a section.

---

# Hero Section

The Hero is the primary visual focal point.

Use a large editorial layout inspired by modern personal portfolios.

## Layout

Desktop:

Two-column or asymmetric composition.

Left:

- Small introduction label
- Large headline
- Role / professional identity
- Short supporting statement
- Primary CTA
- Secondary CTA

Right:

- Large profile image
- Decorative shape
- Small floating metadata cards

The profile image should visually dominate the hero.

## Typography

Hero headline should use expressive typography.

Recommended:

- 56–72px desktop
- 40–52px tablet
- 36–44px mobile

Use Inter Bold or ExtraBold.

Use selective accent coloring for important words.

Do not color the entire headline.

## Hero Content

The hero content must come from Site Settings.

Use:

`heroTitle`

`heroSubtitle`

`avatar`

`resume`

Do not hardcode editable content.

## Hero CTA

Primary:

`View My Work`

Scrolls to:

`/#portfolio`

Secondary:

`Download CV`

Only display the button if a resume exists.

## Decorative Elements

Allowed:

- Small stars
- Dots
- Geometric outlines
- Circular badges
- Accent shapes
- Small floating labels

Decorations must remain subtle.

Do not allow decorations to interfere with readability.

---

# Marquee / Technology Strip

Place a horizontal scrolling strip directly below the Hero.

Purpose:

Showcase technologies, specialties, or keywords.

Example:

`DATA ANALYSIS ✦ PYTHON ✦ SQL ✦ NEXT.JS ✦ AI ✦ WEB DEVELOPMENT ✦`

Use the existing skill data where appropriate.

The marquee should:

- Move slowly
- Loop seamlessly
- Use subtle animation
- Remain readable
- Support reduced motion

Use the primary or accent color as the strip background.

Avoid excessive animation speed.

---

# About Section

The About section should introduce the person behind the portfolio.

Use an asymmetric layout.

Desktop:

Left:

- Section label
- Large heading
- Short introduction

Right:

- Full biography
- Supporting information
- Optional statistics

The biography must come from:

`Settings.about`

Do not hardcode biography content.

---

# Skills Section

Skills should be presented as categorized groups.

Use:

`Skill.category`

Each skill displays:

- Icon if available
- Skill name
- Proficiency level

The proficiency level may be represented by:

- Progress bar
- Radial indicator
- Animated percentage

Prefer horizontal progress indicators for a cleaner editorial style.

Animation should occur when the element enters the viewport.

Do not make proficiency animation distracting.

---

# Experience Section

Experience should use a chronological timeline.

Sort:

`startDate DESC`

Each experience item should display:

- Position
- Company
- Date range
- Short description
- Technology / relevant skills if available
- Image preview if available
- View Details button

Date format:

`MMM YYYY – MMM YYYY`

or:

`MMM YYYY – Present`

The Experience section should visually emphasize the most recent experience.

---

# Experience Detail Page

Route:

`/experience/[id]`

The detail page should contain:

- Back to Portfolio / Experience
- Position
- Company
- Date range
- Full description
- Image gallery
- Related skills
- External company link if available

Use a large editorial header.

Use the image gallery as a visual storytelling element.

If multiple images exist, provide:

- Gallery grid
- Lightbox
- Keyboard navigation

The page must gracefully handle missing images.

---

# Portfolio Section

Portfolio is one of the primary sections of the website.

Use:

- Section heading
- Short introduction
- Category filter
- Featured project
- Project grid/list

## Featured Project

Projects where:

`featured === true`

should receive stronger visual emphasis.

Use a large featured project card.

The featured project may use:

- Large image
- Project title
- Category
- Description
- Technology tags
- View Details button
- GitHub button
- Live Demo button

---

# Portfolio Project List

Projects should support category filtering.

Example:

`All`

`Data Analysis`

`Web Development`

`AI`

`UI/UX`

The category list should be generated from available project data where possible.

Do not hardcode categories unnecessarily.

Project cards should contain:

- Thumbnail
- Title
- Category
- Short description
- Technology tags
- View Details button

Do not place the entire project description inside the card.

Keep cards concise.

---

# Portfolio Detail Page

Route:

`/portfolio/[id]`

The detail page should contain:

- Project title
- Category
- Hero image
- Project description
- Technology information
- Image gallery
- GitHub button if available
- Live Demo button if available

Use:

`images[0]`

as the primary project image.

Use the remaining images as the project gallery.

If no GitHub URL exists, hide the GitHub button.

If no Demo URL exists, hide the Live Demo button.

The page should feel like a detailed case study.

---

# Contact Section

The Contact section should be visually prominent.

Use an editorial CTA layout.

Example structure:

Large heading:

`Let's work together.`

Supporting text.

Contact actions:

- Email
- Phone
- LinkedIn
- GitHub

Data must come from the Contact model.

Email:

`mailto:`

Phone:

`tel:`

External social links:

Open in a new tab.

The contact section should be one of the strongest calls-to-action on the page.

---

# Footer

Footer should remain minimal.

Include:

- Name / logo
- Short role
- Social links
- Copyright
- Back to top

Do not overcrowd the footer.

---

# Layout Principles

The public portfolio should avoid a uniform card-grid-only layout.

Use a mixture of:

- Full-width sections
- Two-column layouts
- Asymmetric grids
- Large editorial typography
- Timeline layouts
- Featured cards
- Compact cards
- Image-led layouts

The composition should have visual rhythm.

Avoid making every section look identical.

---

# Section Rhythm

Each major section should have:

1. Small section label
2. Large section heading
3. Supporting description
4. Main content

Example:

`01 — ABOUT`

`A little about me`

`Short supporting paragraph`

Then the content.

Section labels may use monospace typography.

---

# Visual Hierarchy

Priority:

1. Hero
2. Featured Projects
3. Experience
4. Skills
5. About
6. Contact

Use size, spacing, and contrast rather than excessive colors to establish hierarchy.

---

# Animation System

Animations should enhance the experience without becoming distracting.

Use Framer Motion or the project's existing animation solution.

## Allowed Animations

### Page Entrance

- Fade
- Fade + slight vertical movement

Duration:

200–500ms

### Section Reveal

Elements may reveal when entering the viewport.

Use:

- opacity
- translateY
- scale

Keep movement subtle.

### Cards

On hover:

- Slight translate
- Slight image zoom
- Shadow elevation
- Border/accent transition

Avoid large scaling.

### Buttons

Use:

- Color transition
- Icon movement
- Small arrow translation

### Images

Portfolio and experience images may use:

- Slight zoom on hover
- Fade transition
- Lightbox transition

---

# Hero Animation

The Hero may use layered entrance animations.

Recommended order:

1. Section label
2. Hero title
3. Subtitle
4. CTA
5. Profile image
6. Decorative elements

Use staggered animation.

Avoid delaying important content excessively.

---

# Scroll Animation

Use viewport-based animations.

Sections should animate only once when entering the viewport.

Do not animate every scroll event continuously.

Avoid excessive parallax.

---

# Reduced Motion

Respect:

`prefers-reduced-motion`

When reduced motion is enabled:

- Disable marquee animation
- Disable large transforms
- Disable parallax
- Use simple opacity transitions
- Keep content immediately accessible

Accessibility takes priority over animation.

---

# Hover Interaction

Hover effects must never be required to understand content.

All important information must remain accessible without hover.

Touch devices must have equivalent interactions.

---

# Responsive Behavior

## Desktop

Use asymmetric layouts and large typography.

## Tablet

Reduce:

- typography
- spacing
- image sizes

Maintain the overall composition.

## Mobile

Stack complex layouts vertically.

Hero:

Image

↓

Heading

↓

Description

↓

CTA

Avoid horizontal overflow.

Marquee may remain horizontal but must be clipped safely.

Portfolio:

Use a single-column layout.

Experience:

Use a simplified vertical timeline.

---

# Image Rules

Use optimized images.

Portfolio:

- Preserve aspect ratio
- Use object-cover for cards
- Use object-contain or appropriate sizing for detailed screenshots

Profile:

- Prefer portrait-friendly crop
- Avoid excessive cropping

Every image requires meaningful alt text.

Decorative images may use empty alt attributes.

---

# Content Rules

Cards should prioritize concise information.

Avoid large paragraphs inside cards.

Use detail pages for full descriptions.

The homepage is a summary.

Detail pages are for deeper exploration.

---

# Interaction Model

The homepage should provide quick scanning.

The user should understand:

- Who I am
- What I do
- What I know
- What I have worked on
- How to contact me

within the first few scrolls.

Detailed information should be progressively disclosed through:

- Portfolio detail pages
- Experience detail pages

---

# Public Website Performance

Prefer Server Components.

Use Client Components only when interaction is required.

Animations must not block rendering.

Lazy-load below-the-fold images.

Optimize portfolio images.

Avoid unnecessary JavaScript.

Do not load animation libraries globally if only a few components require them.

---

# SEO

The homepage should have:

- Dynamic title
- Dynamic description
- Open Graph metadata
- Twitter/X metadata
- Canonical URL

Portfolio detail pages should generate dynamic metadata using project information.

Experience detail pages should generate dynamic metadata using experience information.

Use semantic headings.

Only one primary H1 should be used on the homepage.

---

# Component Architecture

Create reusable components.

Recommended:

components/
├── layout/
│   ├── navbar
│   └── footer
│
├── sections/
│   ├── hero
│   ├── about
│   ├── skills
│   ├── experience
│   ├── portfolio
│   └── contact
│
├── portfolio/
│   ├── portfolio-card
│   ├── featured-project
│   ├── category-filter
│   └── project-gallery
│
├── experience/
│   ├── experience-timeline
│   ├── experience-card
│   └── experience-gallery
│
└── ui/
    └── reusable UI components

Do not duplicate components between the homepage and detail pages.

---

# Design Constraints

Do not:

- Copy another portfolio website exactly
- Use excessive gradients
- Use excessive glassmorphism
- Use excessive rounded cards
- Use excessive animations
- Use large parallax effects
- Use autoplay video backgrounds
- Use decorative elements that reduce readability
- Hardcode editable portfolio content
- Create separate pages for homepage sections

The design should be inspired by modern editorial developer portfolios while remaining original and consistent with the Minimal Design System.