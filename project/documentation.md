# Documentation

The Pixelfed Glitch documentation can be found at [pixelfed-glitch.github.io/docs].
The source code repository for the documentation is hosted on GitHub at [pixelfed-glitch/docs].
If you find any mistakes in the documentation, please have a look at the [open issues](https://github.com/pixelfed-glitch/docs/issues) and open a new one if yours does not exist.

## Contributing to Documentation

The following sections should get you started on contributing to the documentation of Pixelfed.
Before getting started, please read the [Code of Conduct].

## Writing Documentation Online

To get started writing the documentation, you only need a GitHub account.
You can find the documentation in its [GitHub repository][pixelfed-glitch/docs].
Find the right page and after log-in, you can see an edit button above the document.
Please create a Pull Request with your changes.
We are using [Markdown] as the format for the documentation files (`.md`).

[Markdown]: https://www.markdownguide.org/cheat-sheet/

## Building the Documentation Locally

For most additions and changes to the documentation, you do not need to build the documentation locally.

If you choose to build the documentation website on your own computer, follow these steps:

1. Clone the [pixelfed-glitch/docs] repository.

    ```sh
    git clone https://github.com/pixelfed-glitch/docs.git pixelfed-glitch-docs
    cd pixelfed-glitch-docs
    ```

2. Install [node and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).
3. Install [VitePress] and the other dependencies.

    ```sh
    # in the pixelfed-glitch-docs directory
    npm install
    ```

4. Build and serve the documentation:

    ```sh
    npm run docs:dev
    ```

    Then, visit `http://localhost:5173/` in your browser.
    It should look like [pixelfed-glitch.github.io/docs].
    Now, whenever you change a file, it should automatically reload with the changes.

## Related Links

- [Markdown]
- [VitePress]
- [Code of Conduct]
- [The Glitch official documentation][https://pixelfed-glitch.github.io/docs]
- [The upstream official documentation][https://docs.pixelfed.org]
- [The documentation repository][https://github.com/pixelfed-glitch/docs]

[VitePress]: https://vitepress.dev/
[pixelfed-glitch.github.io/docs]: https://pixelfed-glitch.github.io/docs
[Code of Conduct]: https://github.com/pixelfed-glitch/docs/blob/main/CODE_OF_CONDUCT.md
[pixelfed-glitch/docs]: https://github.com/pixelfed-glitch/docs

https://pixelfed-glitch.github.io/docs