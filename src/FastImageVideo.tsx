import React from 'react'
import classnames from 'classnames'
import { cssContainerInner, cssContainerOuter, cssAsset } from './styles'
import { FastImageCommonProps } from './FastImage'
import { videoTagString } from 'react-video-tag'
import { getPaddingBottom } from './getPaddingBottom'
import { noscript } from './noscript'
import supportsWebP from './supportsWebP'

export interface FastImageVideoProps extends FastImageCommonProps {
    src: string
    posterSrc: string
    posterWebPSrc: string
    posterBase64: string
}

export class FastImageVideo extends React.PureComponent<Partial<FastImageVideoProps>> {
    media?: HTMLVideoElement
    inner?: HTMLElement
    outer?: HTMLElement
    intersectionObserver?: IntersectionObserver

    constructor(props: FastImageVideoProps) {
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

    onVisible = () => {
        if (!this.inner) return
        const media: any = document.createElement('video')
        media.className = classnames(cssAsset, this.props.mediaClassName)

        media.src = this.src()
        media.setAttribute('src', this.src())

        media.poster = this.poster()
        media.setAttribute('poster', this.poster())

        media.muted = true
        media.setAttribute('muted', '')

        media.playsinline = true
        media.setAttribute('playsinline', '')

        media.autoplay = true
        media.setAttribute('autoplay', '')

        media.loop = true
        media.setAttribute('loop', '')

        this.inner.appendChild(media)
    }

    captureInnerRef = (ref: HTMLElement) => (this.inner = ref)
    captureOuterRef = (ref: HTMLElement) => {
        if (ref && this.intersectionObserver) {
            this.intersectionObserver.observe(ref)
        }
        this.outer = ref
    }

    src = () => this.props.src || ''
    poster = () =>
        supportsWebP ? this.props.posterWebPSrc || this.props.posterSrc : this.props.posterSrc

    render() {
        const {
            posterBase64,
            className,
            containerInnerClassName,
            containerOuterClassName,
            mediaClassName,
            lazy,
            height,
            width,
        } = this.props
        const videoHtml = videoTagString({
            src: this.src(),
            poster: this.poster(),
            muted: true,
            autoPlay: true,
            playsInline: true,
            loop: true,
            className: classnames(cssAsset, mediaClassName),
        })
        const html = lazy ? noscript(videoHtml) : videoHtml
        return (
            <span
                style={{ width }}
                className={classnames(cssContainerOuter, containerOuterClassName, className)}
                ref={this.captureOuterRef}
            >
                <span
                    className={classnames(cssContainerInner, containerInnerClassName)}
                    style={{
                        paddingBottom: getPaddingBottom(width, height),
                        backgroundSize: 'cover',
                        backgroundImage: posterBase64 ? `url('${posterBase64}')` : undefined,
                    }}
                    ref={lazy ? this.captureInnerRef : undefined}
                    dangerouslySetInnerHTML={{ __html: html }}
                />
            </span>
        )
    }
}
