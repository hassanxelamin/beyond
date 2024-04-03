[ ReactReader Component ]
  |
  |---[ EpubView ]
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
  `---[ Child Components ]
          |
          |---[ SwipeWrapper (Optional for swipe navigation) ]
          |       `-- Enhances user interaction with swipeable navigation.
          |
          `---[ TocItem (for rendering Table of Contents) ]
                  |-- Interactive elements for navigating the eBook's sections.
                  `-- Can recursively render nested items for hierarchical ToC structures.
