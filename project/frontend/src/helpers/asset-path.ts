const base = import.meta.env.BASE_URL;

export function public_asset(path: string) {
	const clean_base = base.endsWith('/') ? base.slice(0, -1) : base;
	const clean_path = path.startsWith('/') ? path : `/${path}`;

	return `${clean_base}${clean_path}`;
}

export function app_icon(app_id: string, file = '256.png') {
	return public_asset(`/app-icons/${app_id}/${file}`);
}
