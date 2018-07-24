import React from 'react'
import { FastImageImage } from './FastImageImage'
import { FastImageVideo } from './FastImageVideo'

export interface FastImageCommonProps {
    className?: string
    /**
     * Media is sorrounded by two spans for positioning.
     * This class will be added to the outer span.
     */
    containerOuterClassName?: string
    /**
     * Media is sorrounded by two spans for positioning.
     * This class will be added to the inner span.
     */
    containerInnerClassName?: string
    /**
     * The css class that will go on the media element (img or video).
     */
    mediaClassName?: string
    /**
     * This class is added after the media is shown for one frame.
     * It can be used to add css transitions for when the media enters.
     */
    mediaVisibleClassName?: string
    /**
     * Determines when the media will be loaded.
     * e.g. 200px
     */
    lazyLoadMargin?: string
    /**
     * The original width of the media.
     */
    width?: number
    /**
     * The original height of the media.
     */
    height?: number
    onLoad?: Function
    onAddedToDOM?: Function
}

export interface FastImageProps extends FastImageCommonProps {
    // img
    imgSrc?: string
    imgSrcSet?: string
    // video
    videoSrc?: string
    // videoPoster
    videoPosterSrc?: string
    videoPosterSrcSet?: string
}

const defaultProps = {
    lazyLoadMargin: '500px',
}

export class FastImage extends React.PureComponent<FastImageProps> {
    static defaultProps: FastImageProps = defaultProps
    render() {
        const {
            imgSrc,
            imgSrcSet,
            videoSrc,
            videoPosterSrc,
            videoPosterSrcSet,
            ...otherProps
        } = this.props
        if (this.props.imgSrc) {
            return <FastImageImage src={imgSrc} srcSet={imgSrcSet} {...otherProps} />
        }
        return (
            <FastImageVideo
                src={videoSrc}
                videoPoster={videoPosterSrc}
                videoPosterSrcSet={videoPosterSrcSet}
                {...otherProps}
            />
        )
    }
}
