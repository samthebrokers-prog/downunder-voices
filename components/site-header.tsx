const navLinks = [
  ...categories
    .filter((c) => c.slug !== 'editorial-view')
    .map((c) => ({
      href: `/category/${c.slug}`,
      label: c.name === "Sam's View" ? 'Opinion' : c.name,
    })),
  { href: '/submit', label: 'Submit Your Story' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]
