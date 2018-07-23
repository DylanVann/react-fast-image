import React from 'react'
import classnames from 'classnames'
import { cssContainerInner, cssContainerOuter, cssAsset } from './styles'
import { FastImageCommonProps } from './FastImage'
import { getPaddingBottom } from './getPaddingBottom'

export interface FastImageImageProps extends FastImageCommonProps {
    src?: string
    srcSet?: string
    alt?: string
    title?: string
    sizes?: string
}

export class FastImageImage extends React.PureComponent<FastImageImageProps> {
    media?: HTMLImageElement
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
        if (this.media) {
            this.media.className = classnames(
                cssAsset,
                this.props.mediaClassName,
                this.props.mediaVisibleClassName,
            )
        }
    }

    onDecode = () => {
        if (this.inner && this.media) {
            this.inner.appendChild(this.media)
            requestAnimationFrame(this.onNextFrame)
        }
    }

    onLoad = () => {
        if ((this.media as any).decode) {
            ;(this.media as any).decode().then(this.onDecode)
        } else {
            requestAnimationFrame(this.onDecode)
        }
    }

    onVisible = () => {
        const media = document.createElement('img')
        // We will load the image, then decode it, then add it to the DOM.
        // By doing this we can ensure we will minimize frame drops.
        media.onload = this.onLoad
        // Set props.
        media.src = this.props.src || ''
        media.srcset = this.props.srcSet || ''
        media.alt = this.props.alt || ''
        media.title = this.props.title || ''
        media.sizes = this.props.sizes || ''
        media.className = classnames(cssAsset, this.props.mediaClassName)
        this.media = media
    }

    captureInnerRef = (ref: HTMLElement) => (this.inner = ref)
    captureOuterRef = (ref: HTMLElement) => {
        this.outer = ref
        addObserver(ref, 100, this.onVisible)
    }

    render() {
        return (
            <span
                className={classnames(cssContainerOuter, this.props.containerOuterClassName)}
                ref={this.captureOuterRef}
            >
                <span
                    className={classnames(cssContainerInner, this.props.containerInnerClassName)}
                    style={{ paddingBottom: getPaddingBottom(this.props.width, this.props.height) }}
                    ref={this.captureInnerRef}
                />
            </span>
        )
    }
}
