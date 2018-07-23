interface Listener {
    el: HTMLElement
    cb: Function
}

interface ObserverWithListeners {
    io: IntersectionObserver
    listeners: Listener[]
}

const visibilityObserverMap: {
    [key: string]: ObserverWithListeners
} = {}

export const addObserver = (el: HTMLElement, margin: number, cb: Function) => {
    if (typeof window === `undefined`) return
    if (!IntersectionObserver) return

    // Try to get the ioListener.
    let ioListener = visibilityObserverMap[margin]

    if (!ioListener) {
        // If we don't have it initialize it.
        const listeners: Listener[] = []
        const callback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                listeners.forEach(({ el, cb }) => {
                    if (el === entry.target) {
                        // Edge doesn't currently support isIntersecting, so also test for an intersectionRatio > 0
                        if (entry.isIntersecting || entry.intersectionRatio > 0) {
                            visibilityObserverMap[margin].io.unobserve(el)
                            cb()
                        }
                    }
                })
            })
        }
        const io = new IntersectionObserver(callback, {
            rootMargin: `${margin}px`,
        })
        ioListener = {
            listeners,
            io,
        }
        visibilityObserverMap[margin] = ioListener
    }

    ioListener.listeners.push({ el, cb })
    ioListener.io.observe(el)
}
