export function inView(
	node: HTMLElement,
	options = { threshold: 0.5, rootMargin: '-20% 0px -20% 0px' }
) {
	if (typeof window === 'undefined') return;

	const observer = new IntersectionObserver(
		(entries) => {
			const isMobile = window.matchMedia('(max-width: 768px)').matches;
			// If not mobile, we might want to remove the class just in case, or do nothing.
			// But the user specifically asked for "in mobile view".
			if (!isMobile) {
				node.classList.remove('in-view');
				return;
			}

			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					node.classList.add('in-view');
				} else {
					node.classList.remove('in-view');
				}
			});
		},
		{
			threshold: options.threshold,
			rootMargin: options.rootMargin
		}
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
