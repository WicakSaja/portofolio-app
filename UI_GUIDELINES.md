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