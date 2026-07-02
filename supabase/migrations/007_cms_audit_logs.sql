-- -------------------------------------------------------------
-- ZORVATE V2: SEED DYNAMIC CMS SETTINGS FOR HERO, NAV, FOOTER, SEO
-- -------------------------------------------------------------

insert into public.site_settings (key, value, label) values
-- Hero Configurations
('hero_title', 'High-Fidelity Software Engineering Studio', 'Hero Title'),
('hero_subtitle', 'We design and build bespoke software platforms, analytics workspaces, and high-performance user interfaces for startups and enterprise teams.', 'Hero Subtitle'),
('hero_cta_text', 'Initiate Consultation', 'Hero CTA Button Text'),

-- SEO Configurations
('seo_title', 'Zorvate — High-Fidelity Software Engineering Studio', 'SEO Meta Title'),
('seo_description', 'We design and build bespoke software platforms, analytics workspaces, and high-performance user interfaces for startups and enterprise teams.', 'SEO Meta Description'),
('seo_keywords', 'software development, next.js, react, supabase, postgresql, tailwind css, design systems, digital agency, startup-friendly', 'SEO Meta Keywords'),

-- Navigation Map Links (JSON list)
('navigation_links', '[{"title": "About Studio", "href": "/about"}, {"title": "Services", "href": "/services"}, {"title": "Portfolio", "href": "/portfolio"}, {"title": "Pricing Desk", "href": "/pricing"}, {"title": "Careers", "href": "/careers"}, {"title": "Contact Desk", "href": "/contact"}]', 'Header Navigation Links'),

-- Footer Map Links (JSON list)
('footer_links', '[{"title": "About Studio", "href": "/about"}, {"title": "Digital Services", "href": "/services"}, {"title": "Portfolio Archive", "href": "/portfolio"}, {"title": "Contact Desk", "href": "/contact"}]', 'Footer Quick Links')
on conflict (key) do nothing;
