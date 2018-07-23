export const getPaddingBottom = (width?: number, height?: number) => {
    if (!width || !height) return '100%'
    return `${(height / width) * 100}%`
}
