import React from 'react'
import { FastImageImage } from './FastImageImage'
import { FastImageVideo } from './FastImageVideo'

export interface FastImageCommonProps {
    /**
     * Media is surrounded by two spans for positioning.
     * This class will be added to the outer span.
     */
    className?: string
    /**
     * Media is surrounded by two spans for positioning.
     * This class will be added to the outer span.
     * This class will be added when the image is visible and added to the DOM.
     */
    classNameVisible?: string
    /**
     * Media is surrounded by two spans for positioning.
     * This class will be added to the inner span.
     */
    classNameContainer?: string
    /**
     * Media is surrounded by two spans for positioning.
     * This class will be added to the inner span.
     * This class will be added when the image is visible and added to the DOM.
     */
    classNameContainerVisible?: string
    /**
     * The css class that will go on the media element (img or video).
     */
    classNameMedia?: string
    /**
     * The css class that will go on the media element (img or video).
     * This class will be added when the image is visible and added to the DOM.
     */
    classNameMediaVisible?: string
    /**
     * Whether or not to wait for the image to enter the viewport to load it.
     */
    lazy?: boolean
    /**
     * Determines when the media will be loaded.
     * e.g. 200px
     */
    lazyLoadMargin?: string
    /**
     * The original width of the media.
     */
    width: number
    /**
     * The original height of the media.
     */
    height: number
    onLoad?: Function
    onAddedToDOM?: Function
}

export interface FastImageImageBestProps extends FastImageCommonProps {
    // img
    imgAlt: string
    imgSizes: string
    imgSrc: string
    imgSrcSet: string
    imgBase64: string
    // img webp
    imgWebPSrc: string
    imgWebPSrcSet: string
}

export interface FastImageVideoBestProps extends FastImageCommonProps {
    // video
    videoSrc: string
    // videoPoster
    videoPosterSrc: string
    videoPosterWebPSrc: string
    videoPosterBase64: string
}

export type FastImageBestProps = FastImageImageBestProps & FastImageVideoBestProps
export type FastImageProps = Partial<FastImageImageBestProps & FastImageVideoBestProps>

const defaultProps = {
    lazy: true,
    lazyLoadMargin: '500px',
}

export class FastImage extends React.PureComponent<FastImageProps> {
    static defaultProps: FastImageProps = defaultProps as FastImageProps
    render() {
        if (this.props.imgSrc) {
            const {
                imgAlt,
                imgSizes,
                imgSrc,
                imgSrcSet,
                imgWebPSrc,
                imgWebPSrcSet,
                imgBase64,
                ...otherProps
            } = this.props
            return (
                <FastImageImage
                    src={imgSrc as string}
                    srcSet={imgSrcSet as string}
                    base64={imgBase64 as string}
                    webPSrc={imgWebPSrc as string}
                    webPSrcSet={imgWebPSrcSet as string}
                    alt={imgAlt as string}
                    sizes={imgSizes as string}
                    {...otherProps}
                />
            )
        }
        if (this.props.videoSrc) {
            const {
                videoSrc,
                videoPosterSrc,
                videoPosterWebPSrc,
                videoPosterBase64,
                ...otherProps
            } = this.props
            return (
                <FastImageVideo
                    src={videoSrc as string}
                    posterSrc={videoPosterSrc as string}
                    posterWebPSrc={videoPosterWebPSrc as string}
                    posterBase64={videoPosterBase64 as string}
                    {...otherProps}
                />
            )
        }
        console.error('No src for FastImage.')
        return null
    }
}
