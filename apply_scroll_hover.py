import re
import os

files = [
    '/Users/abdo/newContent/web-devlopment/clients-projects/orcado/src/lib/components/Footer.svelte'
]

def process_file(file_path):
    with open(file_path, 'r') as f:
        content = f.read()

    # 1. Add import if missing
    if 'import { inView }' not in content:
        content = content.replace('<script lang="ts">', '<script lang="ts">\n\timport { inView } from \'$lib/actions/inView\';')

    # 2. Add use:inView to interactive cards/items
    # WhyChooseUs: class="why-item ... group ..."
    # SocialProof: class="stat-card ... group ..."
    # FAQ: class="interactive-card ... group ..."
    # CTA: class="interactive-card ... group ..." AND class="group/btn ..."
    
    def add_use_action(match):
        tag_content = match.group(1)
        if 'use:inView' in tag_content:
            return match.group(0)
        # Insert use:inView before class=
        return re.sub(r'(\s+class=)', r' use:inView\1', match.group(0), count=1)

    # Apply to divs and a tags and buttons with 'group' OR 'hover:' in class
    # We use re.DOTALL to handle multiline tags if any (though usually opening tag is one line or we match until >)
    # Actually, <div ... class="..."> might span lines.
    # Regex: <(div|a|button)[^>]*class="[^"]*(?:group|hover:)[^"]*"[^>]*>
    
    content = re.sub(r'(<(?:div|a|button)\b[^>]*?\bclass="[^"]*?(?:\bgroup\b|hover:)[^"]*?"[^>]*?>)', add_use_action, content, flags=re.DOTALL)

    # 3. Replace group-hover variants (standard and named)
    
    # Handle named groups first: group-hover/name:class
    # Avoid replacing if already replaced (naive check)
    def replacer_named_group(match):
        group_name = match.group(1)
        cls = match.group(2)
        new_variant = f"group-[.in-view]/{group_name}:{cls}"
        full_match = match.group(0)
        if new_variant in content and new_variant not in full_match: 
            # If the variant exists elsewhere, we might be duplicating.
            # But checking if it exists "in content" is too broad.
            # Let's just append it. If it duplicates, Tailwind dedupes or it's just messy but functional.
            pass
        return f"{full_match} {new_variant}"

    content = re.sub(r'group-hover\/([a-zA-Z0-9]+):([a-zA-Z0-9\-\/\[\]\.\(\)\#\%]+)', replacer_named_group, content)

    # Handle standard groups: group-hover:class
    def replacer_group(match):
        cls = match.group(1)
        new_variant = f"group-[.in-view]:{cls}"
        full_match = match.group(0)
        return f"{full_match} {new_variant}"

    content = re.sub(r'group-hover:([a-zA-Z0-9\-\/\[\]\.\(\)\#\%]+)', replacer_group, content)

    # 4. Replace standard hover variants (excluding group-hover)
    def replacer_hover(match):
        cls = match.group(1)
        new_variant = f"[&.in-view]:{cls}"
        full_match = match.group(0)
        return f"{full_match} {new_variant}"
    
    content = re.sub(r'(?<!group-)hover:([a-zA-Z0-9\-\/\[\]\.\(\)\#\%]+)', replacer_hover, content)

    with open(file_path, 'w') as f:
        f.write(content)

for f in files:
    print(f"Processing {f}...")
    process_file(f)
