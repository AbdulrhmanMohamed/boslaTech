let isOpen = $state(false);

export function toggleDrawer() {
	isOpen = !isOpen;
}

export function openDrawer() {
	isOpen = true;
}

export function closeDrawer() {
	isOpen = false;
}

export function getDrawerState() {
	return isOpen;
}
