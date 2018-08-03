import React from 'react'
import classnames from 'classnames'
import { cssContainerInner, cssContainerOuter, cssAsset } from './styles'
import { FastImageCommonProps } from './FastImage'
import { getPaddingBottom } from './getPaddingBottom'
import { imgTagString } from 'react-img-tag'
import { noscript } from './noscript'
import supportsWebP from './supportsWebP'

export interface FastImageImageProps extends FastImageCommonProps {
    alt: string
    src: string
    srcSet: string
    base64: string
    webPSrc: string
    webPSrcSet: string
    sizes: string
}

export class FastImageImage extends React.PureComponent<Partial<FastImageImageProps>> {
    media?: HTMLImageElement
    inner?: HTMLElement
    outer?: HTMLElement
    intersectionObserver?: IntersectionObserver

    constructor(props: FastImageImageProps) {
        super(props)
        // tslint:disable-next-line
        if (typeof window === 'undefined') return
        if ((window as any).IntersectionObserver) {
            this.intersectionObserver = new IntersectionObserver(this.onIntersection, {
                rootMargin: props.lazyLoadMargin,
            })
        }
    }

    onIntersection = (entries: IntersectionObserverEntry[]) => {
        if (!this.intersectionObserver) return
        const entry = entries[0] || {}
        // Edge doesn't currently support isIntersecting, so also test for an intersectionRatio > 0
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
            this.intersectionObserver.unobserve(entry.target)
            this.onVisible()
        }
    }

    componentWillUnmount() {
        if (!this.intersectionObserver) return
        if (this.outer) {
            this.intersectionObserver.unobserve(this.outer)
        }
    }

    onNextFrame = () => {
        if (this.media && this.props.mediaVisibleClassName) {
            this.media.classList.add(this.props.mediaVisibleClassName)
        }
    }

    onDecode = () => {
        if (this.inner && this.media) {
            this.inner.appendChild(this.media)
            setTimeout(this.onNextFrame, 32)
            if (this.props.onAddedToDOM) {
                this.props.onAddedToDOM()
            }
        }
    }

    onLoad = () => {
        if ((this.media as any).decode) {
            ;(this.media as any).decode().then(this.onDecode)
        } else {
            setTimeout(this.onDecode)
        }
    }

    src = () => (supportsWebP ? this.props.webPSrc || this.props.src : this.props.src) || ''
    srcSet = () =>
        (supportsWebP ? this.props.webPSrcSet || this.props.srcSet : this.props.srcSet) || ''

    onVisible = () => {
        const media = document.createElement('img')
        // We will load the image, then decode it, then add it to the DOM.
        // By doing this we can ensure we will minimize frame drops.
        media.onload = this.onLoad
        // Set props.
        media.src = this.src()
        media.srcset = this.srcSet()
        media.alt = this.props.alt || ''
        media.sizes = this.props.sizes || ''
        media.className = classnames(cssAsset, this.props.mediaClassName)
        this.media = media
    }

    captureInnerRef = (ref: HTMLElement) => (this.inner = ref)
    captureOuterRef = (ref: HTMLElement) => {
        if (ref && this.intersectionObserver) {
            this.intersectionObserver.observe(ref)
        }
        this.outer = ref
    }

    render() {
        const {
            className,
            containerInnerClassName,
            containerOuterClassName,
            mediaClassName,
            lazy,
            alt,
            sizes,
            height,
            width,
        } = this.props
        const imgHtml = imgTagString({
            src: this.src(),
            srcSet: this.srcSet(),
            alt,
            sizes,
            className: classnames(cssAsset, mediaClassName),
        })
        const html = lazy ? noscript(imgHtml) : imgHtml
        return (
            <span
                style={{ width }}
                className={classnames(
                    cssContainerOuter,
                    containerOuterClassName,
                    className,
                )}
                ref={this.captureOuterRef}
            >
                <span
                    className={classnames(cssContainerInner, containerInnerClassName)}
                    style={{ paddingBottom: getPaddingBottom(width, height) }}
                    ref={lazy ? this.captureInnerRef : undefined}
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </span>
        )
    }
}
