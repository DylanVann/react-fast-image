import React from 'react'
import classnames from 'classnames'
import { cssContainerInner, cssContainerOuter, cssAsset } from './styles'
import { videoTagString } from 'react-video-tag'
import { FastImageCommonProps } from './FastImage'
import { getPaddingBottom } from './getPaddingBottom'

export interface FastImageVideoProps extends FastImageCommonProps {
    src: string
    videoPoster: string
    videoPosterSrcSet: string
}

export class FastImageVideo extends React.PureComponent<FastImageVideoProps> {
    media?: HTMLVideoElement
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

    onLoad = () => {
        if (this.inner && this.media) {
            this.inner.appendChild(this.media)
            requestAnimationFrame(this.onNextFrame)
        }
    }

    onVisible = () => {
        const media = document.createElement('video')
        media.oncanplay = this.onLoad
        // We will load the image, then decode it, then add it to the DOM.
        // By doing this we can ensure we will minimize frame drops.
        // Set props.
        media.src = this.props.src || ''
        media.className = classnames(cssAsset, this.props.mediaClassName)
        media.setAttribute('muted', '')
        media.setAttribute('autoplay', '')
        media.setAttribute('playsinline', '')
        media.setAttribute('loop', '')
        this.media = media
    }

    captureInnerRef = (ref: HTMLElement) => (this.inner = ref)
    captureOuterRef = (ref: HTMLElement) => this.intersectionObserver.observe(ref)

    render() {
        const { src } = this.props
        const videoHTML = videoTagString({
            className: classnames(cssAsset, this.props.mediaClassName),
            src,
            muted: true,
            autoPlay: true,
            playsInline: true,
            loop: true,
        })
        return (
            <span
                className={classnames(cssContainerOuter, this.props.containerOuterClassName)}
                ref={this.captureOuterRef}
            >
                <span
                    className={classnames(cssContainerInner, this.props.containerInnerClassName)}
                    style={{ paddingBottom: getPaddingBottom(this.props.width, this.props.height) }}
                    ref={this.captureInnerRef}
                >
                    <noscript
                        dangerouslySetInnerHTML={{
                            __html: videoHTML,
                        }}
                    />
                </span>
            </span>
        )
    }
}
