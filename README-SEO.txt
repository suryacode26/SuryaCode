SURYA CODE website - HTML / CSS / JS.

Structure:
index.html
404.html
css/style.css
js/script.js
robots.txt
sitemap.xml
.htaccess
_redirects

Canonical domain: https://suryacode.com/
(already set in robots.txt, sitemap.xml, canonical/OG/Twitter tags and JSON-LD)

Clean URLs:
Apache (.htaccess) and Netlify (_redirects) rules redirect /page.html -> /page
and internally serve the matching .html file when it exists.

404 handling:
404.html is served automatically by Netlify for unmatched routes, and via
ErrorDocument 404 /404.html on Apache.

If the canonical domain ever changes, update it consistently in:
- index.html (<link rel="canonical">, og:url, JSON-LD @id/url fields)
- 404.html (<link rel="canonical">)
- robots.txt (Sitemap: line)
- sitemap.xml (<loc>)
