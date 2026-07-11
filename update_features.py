
import re

file_path = 'src/lib/components/FeaturesSection.svelte'
with open(file_path, 'r') as f:
    content = f.read()

# Add the effect hook
effect_code = """
	// Mobile Scroll Interaction (Auto-active cards)
	$effect(() => {
		if (typeof window === 'undefined') return;

		const observerOptions = {
			root: null,
			rootMargin: '-20% 0px -20% 0px', // Active when in the middle 60% of screen
			threshold: 0.5
		};

		const observerCallback = (entries: IntersectionObserverEntry[]) => {
			const isMobile = window.matchMedia('(max-width: 768px)').matches;
			if (!isMobile) return;

			entries.forEach((entry) => {
				const cardButton = entry.target.querySelector('.cinematic-glass');
				if (entry.isIntersecting) {
					cardButton?.classList.add('active-card');
				} else {
					cardButton?.classList.remove('active-card');
				}
			});
		};

		const observer = new IntersectionObserver(observerCallback, observerOptions);
		const cards = document.querySelectorAll('.feature-card');
		cards.forEach((card) => observer.observe(card));

		return () => observer.disconnect();
	});
"""

# Insert before the last </script> tag
if 'Mobile Scroll Interaction' not in content:
    content = content.replace('</script>', effect_code + '\n</script>')

# Regex replace for tailwind classes
# Pattern: match group-hover/card: followed by non-whitespace chars (excluding closing quotes etc)
# We use a non-greedy match for the class name
# We want to append the group-[.active-card]/card: variant

def replacer(match):
    cls = match.group(1)
    # Check if we already added it (idempotency)
    if f"group-[.active-card]/card:{cls}" in match.string[match.end():match.end()+50]:
        return match.group(0)
    return f"group-hover/card:{cls} group-[.active-card]/card:{cls}"

# The regex matches group-hover/card: and then captures the class characters
# Valid class chars in tailwind: a-z, A-Z, 0-9, -, _, /, [, ], %, .
content = re.sub(r'group-hover/card:([a-zA-Z0-9\-\/\[\]%\.]+)', replacer, content)

with open(file_path, 'w') as f:
    f.write(content)
