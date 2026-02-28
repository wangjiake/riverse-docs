"""Generate per-language sitemaps for zh/ and ja/ subdirectories."""

import os
import xml.etree.ElementTree as ET


def on_post_build(config, **kwargs):
    site_dir = config["site_dir"]
    root_sitemap = os.path.join(site_dir, "sitemap.xml")
    if not os.path.exists(root_sitemap):
        return

    tree = ET.parse(root_sitemap)
    root = tree.getroot()
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}

    for lang in ("zh", "ja"):
        urls = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
        for url in root.findall("s:url", ns):
            loc = url.find("s:loc", ns)
            if loc is not None and f"/{lang}/" in loc.text:
                urls.append(url)

        lang_dir = os.path.join(site_dir, lang)
        os.makedirs(lang_dir, exist_ok=True)
        out = os.path.join(lang_dir, "sitemap.xml")
        ET.ElementTree(urls).write(out, xml_declaration=True, encoding="UTF-8")
