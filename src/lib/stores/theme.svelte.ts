import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

function createTheme() {
	let currentTheme = $state<Theme>((browser && (localStorage.getItem('theme') as Theme)) || 'light');

	function setTheme(theme: Theme) {
		currentTheme = theme;
		if (browser) {
			localStorage.setItem('theme', theme);
			document.documentElement.setAttribute('data-theme', theme);
		}
	}

	function toggleTheme() {
		setTheme(currentTheme === 'light' ? 'dark' : 'light');
	}

	// Initialize theme on mount/load
	if (browser) {
		const savedTheme = localStorage.getItem('theme') as Theme;
		if (savedTheme) {
			document.documentElement.setAttribute('data-theme', savedTheme);
		} else {
			document.documentElement.setAttribute('data-theme', 'light');
		}
	}

	return {
		get current() {
			return currentTheme;
		},
		setTheme,
		toggleTheme
	};
}

export const theme = createTheme();
