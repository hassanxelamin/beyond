[ ReactReader Component ]
  |
  |---[ State ]
  |       |-- isLoaded: Tracks if the eBook is fully loaded.
  |       |-- expandedToc: Indicates if the Table of Contents (ToC) is expanded.
  |       `-- toc: Stores the hierarchical structure of the eBook's ToC.
  |
  |---[ Props ]
  |       |-- url, title, showToc, readerStyles, epubViewStyles, swipeable, etc.
  |       `-- Callbacks like locationChanged, getRendition, and tocChanged for external interaction.
  |
  |---[ Methods ]
  |       |-- toggleToc(): Toggles the visibility of the ToC.
  |       |-- next() & prev(): Navigation methods to move through the eBook.
  |       |-- onTocChange(): Updates the ToC state and optionally invokes tocChanged prop.
  |       `-- setLocation(): Updates the eBook's current location and invokes locationChanged.
  |
  |---[ Child Components ]
          |
          |---[ SwipeWrapper (Conditional based on `swipeable` prop) ]
          |       `-- Handles swipe gestures for eBook navigation.
          |
          |---[ EpubView ]
          |       |-- Renders the eBook content.
          |       `-- Receives eBook specific props like url, loadingView, etc.
          |       |
          |       |---[ State ]
          |       |       |-- isLoaded: Indicates if the eBook content is fully loaded.
          |       |       `-- toc: Stores the eBook's Table of Contents.
          |       |
          |       |---[ Props ]
          |       |       |-- url: The eBook file URL or binary content.
          |       |       |-- epubInitOptions, epubViewStyles: Configuration for eBook rendering.
          |       |       `-- Callbacks like locationChanged, tocChanged for eBook interaction.
          |       |
          |       |---[ Methods ]
          |       |       |-- initBook(): Loads the eBook using `Epub` and initializes `Book` instance.
          |       |       |-- initReader(): Prepares and displays the eBook content through `Rendition`.
          |       |       |-- registerEvents(): Sets up event listeners for eBook navigation and interaction.
          |       |       `-- renderBook(): Renders the container for the eBook content.
          |       |
          |       |---[ Lifecycle Hooks ]
          |       |       |-- componentDidMount(): Initializes the eBook loading process.
          |       |       |-- componentDidUpdate(): Responds to updates in props like `url` or `location`.
          |       |       `-- componentWillUnmount(): Cleans up resources to prevent memory leaks.
          |       |
          |       |---[ Event Handling ]
          |               |-- handleKeyPress(): Listens for keyboard events for page navigation.
          |               `-- onLocationChange(): Updates eBook location based on user interaction or automatic navigation.
          |
          `---[ TocItem (Recursive for nested ToC items) ]
                  |-- Renders individual ToC entries.
                  `-- Invokes setLocation() on click for navigation.



