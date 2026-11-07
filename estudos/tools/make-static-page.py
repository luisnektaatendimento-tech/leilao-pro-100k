import re, sys
src = open('dist-static/index.html').read()
head = re.search(r'<head>(.*)</head>', src, re.S).group(1)
keep = [l.strip() for l in head.splitlines() if re.match(r'\s*<(script|link rel="(modulepreload|stylesheet)")', l)]
page = """<title>Estudos PJK</title>
<meta name="theme-color" content="#0b0c0e">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
<style>:root{color-scheme:dark;background:#0b0c0e}html,body{background:#0b0c0e;color:#f4f5f7;font-family:'Inter Variable',Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif}</style>
""" + "\n".join(keep) + """
<div id="root"></div>
"""
open('dist-static/estudos-pjk.html', 'w').write(page)
print(page)
