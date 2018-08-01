# react-fast-image

Early stages performant React image component.

I'm not sure the API will be similar to React Native Fast Image, but I didn't want to think up another name.

If this goes well I might merge the projects.

## Features

-   Lazy loading.
-   Async decoding.
    -   Uses `img.decode()` to decode images before adding them to the DOM.
-   Supports HTML5 video GIFS.
-   Works for users with JS disabled.
    When SSR is used media is rendered inside `<noscript>`.
-   Uses padding to reserve space before media is loaded.
    This reduces UI jank.

### Async Decoding

This is very important to prevent frame drops.

Imagine this scenario:

-   A user is scrolling down a page.
-   As they scroll an image loads in (lazy loading).
-   At that time the image is decoded on the main thread.
-   This causes a frame drop, which makes scrolling unpleasant.
-   This looks even worse if there is supposed to be an enter animation on the image.

To prevent this FastImage does decoding of images off the main thread on browsers that support it.

## TypeScript

If you're building up props to pass into `FastImage` you can use `FastImageBestProps`, `FastImageImageBestProps`, and `FastImageVideoBestProps`.
Those types mark all the best practice props as required which will help you make sure you don't forget any of them.

## Usage

```bash
npm install react-fast-image
# or
yarn add react-fast-image
```

## License

[MIT](LICENSE)
