function link(path, qs) {
    if (path.includes('#')) {
        const [basePath, hash] = path.split('#');
        return qs ? `${basePath}?${qs}#${hash}` : path;
    }
    return qs ? `${path}?${qs}` : path;
}
console.log(link('/#pricing', ''));
