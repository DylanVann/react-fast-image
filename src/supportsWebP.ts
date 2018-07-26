// https://github.com/bfred-it/supports-webp
const canvas: any = typeof document === 'object' ? document.createElement('canvas') : {}
canvas.width = canvas.height = 1
const supportsWebP: boolean = canvas.toDataURL
    ? canvas.toDataURL('image/webp').indexOf('image/webp') === 5
    : false
export default supportsWebP
