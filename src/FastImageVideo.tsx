import React from 'react'
import classnames from 'classnames'
import { cssContainerInner, cssContainerOuter, cssAsset } from './styles'
import { FastImageCommonProps } from './FastImage'
import { videoTagString } from 'react-video-tag'
import { getPaddingBottom } from './getPaddingBottom'

export interface FastImageVideoProps extends FastImageCommonProps {
    src?: string
    videoPoster?: string
    videoPosterSrcSet?: string
}

export class FastImageVideo extends React.PureComponent<FastImageVideoProps> {
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
        media.src = this.props.src || ''
        media.muted = true
        media.playsinline = true
        media.autoplay = true
        media.loop = true
        this.inner.appendChild(media)
    }

    captureInnerRef = (ref: HTMLElement) => (this.inner = ref)
    captureOuterRef = (ref: HTMLElement) => {
        if (ref && this.intersectionObserver) {
            this.intersectionObserver.observe(ref)
        }
        this.outer = ref
    }

    render() {
        return (
            <span
                className={classnames(
                    cssContainerOuter,
                    this.props.containerOuterClassName,
                    this.props.className,
                )}
                ref={this.captureOuterRef}
            >
                <span
                    className={classnames(cssContainerInner, this.props.containerInnerClassName)}
                    style={{ paddingBottom: getPaddingBottom(this.props.width, this.props.height) }}
                    ref={this.captureInnerRef}
                >
                    <noscript
                        style={{
                            paddingBottom: getPaddingBottom(this.props.width, this.props.height),
                        }}
                        dangerouslySetInnerHTML={{
                            __html: videoTagString({
                                src: this.props.src,
                                muted: true,
                                autoPlay: true,
                                playsInline: true,
                                loop: true,
                                className: classnames(
                                    cssContainerInner,
                                    this.props.containerInnerClassName,
                                ),
                            }),
                        }}
                    />
                </span>
            </span>
        )
    }
}
