import React from 'react'
import { cssContainerInner, cssContainerOuter, cssAsset } from './styles'
import classnames from 'classnames'
import { imgTagString } from 'react-img-tag'

export interface FastImageImageProps {
    /**
     * Media is sorrounded by two spans for positioning.
     * This class will be added to the outer span.
     */
    containerOuterClassName: string
    /**
     * Media is sorrounded by two spans for positioning.
     * This class will be added to the inner span.
     */
    containerInnerClassName: string
    /**
     * The css class that will go on the media element (img or video).
     */
    mediaClassName: string
    /**
     * This class is added after the media is shown for one frame.
     * It can be used to add css transitions for when the media enters.
     */
    mediaVisibleClassName: string
    lazyLoadMargin: string
    src: string
    srcSet: string
    alt: string
    title: string
    sizes: string
}

export class FastImageImage extends React.PureComponent<FastImageImageProps> {
    img: HTMLImageElement = new Image()
    inner?: HTMLElement
    outer?: HTMLElement

    onIntersection = (entries: IntersectionObserverEntry[]) => {
        const entry = entries[0] || {}
        // Edge doesn't currently support isIntersecting, so also test for an intersectionRatio > 0
        if (entry.isIntersecting || entry.intersectionRatio > 0) {
            this.intersectionObserver.unobserve(entry.target)
            this.onVisible()
        }
    }

    intersectionObserver = new IntersectionObserver(this.onIntersection, {
        rootMargin: this.props.lazyLoadMargin,
    })

    componentWillUnmount() {
        if (this.outer) {
            this.intersectionObserver.unobserve(this.outer)
        }
    }

    onNextFrame = () => {
        this.img.className = classnames(
            cssAsset,
            this.props.mediaClassName,
            this.props.mediaVisibleClassName,
        )
    }

    onDecode = () => {
        this.inner && this.inner.appendChild(this.img)
        requestAnimationFrame(this.onNextFrame)
    }

    onLoad = () => {
        if ((this.img as any).decode) {
            ;(this.img as any).decode().then(this.onDecode)
        } else {
            requestAnimationFrame(this.onDecode)
        }
    }

    onVisible = () => {
        const img = new Image()
        this.img = img
        // We will load the image, then decode it, then add it to the DOM.
        // By doing this we can ensure we will minimize frame drops.
        img.onload = this.onLoad
        // Set props.
        img.src = this.props.src
        img.srcset = this.props.srcSet
        img.alt = this.props.alt
        img.title = this.props.title
        img.sizes = this.props.sizes
        img.className = classnames(cssAsset, this.props.mediaClassName)
    }

    captureInnerRef = (ref: HTMLElement) => {
        this.inner = ref
    }

    captureOuterRef = (ref: HTMLElement) => {
        this.intersectionObserver.observe(ref)
    }

    render() {
        return (
            <span
                className={classnames(cssContainerOuter, this.props.containerOuterClassName)}
                ref={this.captureOuterRef}
            >
                <span
                    className={classnames(cssContainerInner, this.props.containerInnerClassName)}
                    style={{ paddingBottom: '10px' }}
                    ref={this.captureInnerRef}
                >
                    <noscript dangerouslySetInnerHTML={{ __html: imgTagString(this.props) }} />
                </span>
            </span>
        )
    }
}
