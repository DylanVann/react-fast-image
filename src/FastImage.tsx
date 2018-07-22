import React from 'react'
import { FastImageImage } from './FastImageImage'
import { FastImageVideo } from './FastImageVideo'

export interface FastImageCommonProps {
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
    /**
     * Determines when the media will be loaded.
     * e.g. 200px
     */
    lazyLoadMargin: string
    /**
     * The original width of the media.
     */
    width: number
    /**
     * The original height of the media.
     */
    height: number
}

export interface FastImageProps extends FastImageCommonProps {
    // img
    imgSrc: string
    imgSrcSet: string
    // video
    videoSrc: string
    // videoPoster
    videoPosterSrc: string
    videoPosterSrcSet: string
}

export class FastImage extends React.PureComponent<FastImageProps> {
    render() {
        if (this.props.imgSrc) {
            return (
                <FastImageImage
                    src={this.props.imgSrc}
                    srcSet={this.props.imgSrcSet}
                    width={this.props.width}
                    height={this.props.height}
                    containerOuterClassName={this.props.containerOuterClassName}
                    containerInnerClassName={this.props.containerInnerClassName}
                    mediaClassName={this.props.mediaClassName}
                    mediaVisibleClassName={this.props.mediaVisibleClassName}
                    lazyLoadMargin={this.props.lazyLoadMargin}
                />
            )
        }
        return (
            <FastImageVideo
                src={this.props.videoSrc}
                videoPoster={this.props.videoPosterSrc}
                videoPosterSrcSet={this.props.videoPosterSrcSet}
                width={this.props.width}
                height={this.props.height}
                containerOuterClassName={this.props.containerOuterClassName}
                containerInnerClassName={this.props.containerInnerClassName}
                mediaClassName={this.props.mediaClassName}
                mediaVisibleClassName={this.props.mediaVisibleClassName}
                lazyLoadMargin={this.props.lazyLoadMargin}
            />
        )
    }
}
