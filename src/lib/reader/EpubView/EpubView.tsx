/* eslint-disable */
/*
 * Import Statements for the EpubView Component
 */
import React, { Component } from 'react';
import Epub, { Book } from 'epubjs'; // handles the loading and rendering of ePub files.
import type { NavItem, Contents, Rendition, Location } from 'epubjs'; // type imports from epubjs
import { EpubViewStyle as defaultStyles, type IEpubViewStyle } from './style'; // default styles for the EpubView component + IEpubViewStyle type
import type { RenditionOptions } from 'epubjs/types/rendition'; // types from epubjs to configure how books are rendered.
import type { BookOptions } from 'epubjs/types/book'; // types from epubjs to configure how books are interacted with.

/*
 * Type Definitions for EpubView Component
 */

// RenditionOptionsFix extends RenditionOptions from epubjs with an additional property.
// This type modification allows enabling or disabling popups within the ePub content, offering extended functionality over the base epubjs options.
export type RenditionOptionsFix = RenditionOptions & {
  allowPopups: boolean; // Additional property to control popup behavior.
};

// IToc represents the structure of a Table of Contents (ToC) item.
// It's used to type the array representing the ToC, ensuring each item has a label and an href for navigation.
export type IToc = {
  label: string; // The display text for the ToC item.
  href: string; // The link or identifier used to navigate to the ToC item within the eBook.
};

// IEpubViewProps defines the shape of the props that can be passed to the EpubView component.
// This includes everything from the eBook's URL to styling options and callbacks for various events.
export type IEpubViewProps = {
  url: string | ArrayBuffer; // The URL of the ePub file or a binary representation of the ePub file.
  epubInitOptions?: Partial<BookOptions>; // Optional ePub initialization options.
  epubOptions?: Partial<RenditionOptionsFix>; // Optional rendition options, including the extended allowPopups property.
  epubViewStyles?: IEpubViewStyle; // Optional custom styles for the eBook viewer.
  loadingView?: React.ReactNode; // Optional custom loading view component.
  location: string | number | null; // The current location in the eBook, can be a URL fragment, page number, or null.
  locationChanged(value: string): void; // Callback function for when the location within the eBook changes.
  showToc?: boolean; // Flag to control the visibility of the Table of Contents.
  tocChanged?(value: NavItem[]): void; // Optional callback function for when the Table of Contents changes.
  getRendition?(rendition: Rendition): void; // Optional callback function to access the current rendition object.
  handleKeyPress?(): void; // Optional callback function for key press events.
  handleTextSelected?(cfiRange: string, contents: Contents): void; // Optional callback function for text selection within the eBook.
};

// IEpubViewState defines the shape of the state used by the EpubView component.
// This includes flags for whether the eBook is loaded and the current Table of Contents.
type IEpubViewState = {
  isLoaded: boolean; // Flag indicating whether the eBook has finished loading.
  toc: NavItem[]; // The current Table of Contents as an array of NavItems.
};

/*
 * EpubView Component Class Definition - To define the EpubView component's structure, including its state, properties, and initial setup methods.
 * The EpubView class extends React's Component class, enabling it to use React's lifecycle methods and state management.
 */
export class EpubView extends Component<IEpubViewProps, IEpubViewState> {
  // State initialization with two properties: isLoaded (to track if the eBook has loaded) and toc (to store the table of contents).
  state: Readonly<IEpubViewState> = {
    isLoaded: false,
    toc: [],
  };

  // Refs and class properties are declared to manage the eBook viewer, its content, and navigation functions.
  viewerRef = React.createRef<HTMLDivElement>(); // A reference to the div element that will render the eBook content.
  location?: string | number | null; // Current location in the eBook, which could be a string, a number, or null.
  book?: Book; // The epubjs Book instance, representing the eBook itself.
  rendition?: Rendition; // The epubjs Rendition instance, managing how the eBook is rendered.
  prevPage?: () => void; // Function to navigate to the previous page of the eBook.
  nextPage?: () => void; // Function to navigate to the next page of the eBook.

  // The constructor initializes class properties and sets the initial location based on props.
  constructor(props: IEpubViewProps) {
    super(props); // Call the constructor of the parent class (Component).
    this.location = props.location; // Initialize location with the prop value.
    // Initially set book, rendition, prevPage, and nextPage to undefined until they are initialized.
    this.book = this.rendition = this.prevPage = this.nextPage = undefined;
  }

  // componentDidMount is a React lifecycle method that runs after the component is mounted to the DOM.
  componentDidMount() {
    this.initBook(); // Call initBook to load and initialize the eBook.
    // Add an event listener for keyup to handle keyboard navigation within the eBook.
    document.addEventListener('keyup', this.handleKeyPress, false);
  }

  // initBook initializes the eBook using epubjs. It loads the eBook from the URL provided in props and sets up the table of contents.
  initBook() {
    const { url, tocChanged, epubInitOptions } = this.props; // Destructure relevant props.
    if (this.book) {
      this.book.destroy(); // If there is an existing book instance, destroy it before creating a new one.
    }

    // Create a new Book instance with the provided URL and initialization options.
    this.book = Epub(url, epubInitOptions);
    // Once the eBook's navigation (including the ToC) is loaded, update the component's state.
    this.book.loaded.navigation.then(({ toc }) => {
      this.setState(
        {
          isLoaded: true, // Mark the eBook as loaded.
          toc: toc, // Update the state with the loaded table of contents.
        },
        () => {
          // If a tocChanged prop is provided, call it with the new table of contents.
          tocChanged && tocChanged(toc);
          // After updating the state, initialize the reader to render the eBook.
          this.initReader();
        }
      );
    });
  }

  // Title: Lifecycle Methods for EpubView Component
  // Purpose: To manage resources and respond to prop changes during the component's lifecycle.
  // Explanation:

  // componentWillUnmount is a React lifecycle method called right before the component is removed from the DOM.
  componentWillUnmount() {
    if (this.book) {
      this.book.destroy(); // If a book instance exists, destroy it to clean up resources.
    }
    // Reset book, rendition, prevPage, and nextPage to undefined to ensure no memory leaks.
    this.book = this.rendition = this.prevPage = this.nextPage = undefined;
    // Remove the keyup event listener to prevent it from firing after the component is unmounted.
    document.removeEventListener('keyup', this.handleKeyPress, false);
  }

  // shouldComponentUpdate is a React lifecycle method that determines whether the component should re-render.
  shouldComponentUpdate(nextProps: IEpubViewProps) {
    // The component should update (re-render) if it's not loaded yet,
    // or if the location or URL props have changed, indicating a significant change in the eBook being displayed.
    return (
      !this.state.isLoaded ||
      nextProps.location !== this.props.location ||
      nextProps.url !== this.props.url
    );
  }

  // componentDidUpdate is a React lifecycle method called immediately after updating occurs. This is not called for the initial render.
  componentDidUpdate(prevProps: IEpubViewProps) {
    // If the location prop has changed, update the eBook's display to the new location.
    if (
      prevProps.location !== this.props.location &&
      this.location !== this.props.location
    ) {
      this.rendition?.display(this.props.location + '');
    }
    // If the eBook URL has changed, reinitialize the book with the new URL.
    if (prevProps.url !== this.props.url) {
      this.initBook();
    }
  }

  // Title: Reader Initialization and Event Registration
  // Purpose: To set up the eBook reader within the component and handle user interaction and eBook navigation.
  // Explanation:

  // initReader is responsible for initializing the eBook's rendition (visual presentation) in the component.
  initReader() {
    const { toc } = this.state; // Access the table of contents from the component's state.
    const { location, epubOptions, getRendition } = this.props; // Destructure relevant props for configuring the rendition.
    if (this.viewerRef.current) {
      // Ensure the ref to the container div is valid.
      const node = this.viewerRef.current; // The actual DOM element where the eBook will be rendered.
      if (this.book) {
        // Check if the book has been loaded successfully.
        // Create a rendition of the book with specified options (e.g., width, height).
        const rendition = this.book.renderTo(node, {
          width: '100%',
          height: '100%',
          flow: 'scrolled-doc',
          ...epubOptions, // Spread any additional epub options passed via props.
        });
        this.rendition = rendition; // Store the rendition instance for later use.
        // Define methods for navigating to the previous and next pages of the eBook.
        this.prevPage = () => rendition.prev();
        this.nextPage = () => rendition.next();
        this.registerEvents(); // Set up event listeners for the rendition.
        // If provided, call getRendition with the current rendition instance.
        if (getRendition) getRendition(rendition);

        // Display the initial location within the eBook, falling back to the first item in the ToC if unspecified.
        if (typeof location === 'string' || typeof location === 'number') {
          rendition.display(location + '');
        } else if (toc.length > 0 && toc[0].href) {
          rendition.display(toc[0].href);
        } else {
          rendition.display(); // Display the first page if no location is specified.
        }
      }
    }
  }

  // registerEvents sets up event listeners for the rendition to handle eBook navigation and interaction.
  registerEvents() {
    const { handleKeyPress, handleTextSelected } = this.props; // Destructure event handler props.
    if (this.rendition) {
      // Ensure the rendition instance is valid.
      // Listen for location changes within the eBook and update the component's state accordingly.
      this.rendition.on('locationChanged', this.onLocationChange);
      // Listen for keyup events for keyboard navigation within the eBook.
      this.rendition.on('keyup', handleKeyPress || this.handleKeyPress);
      // If a text selection handler is provided, listen for text selection events.
      if (handleTextSelected) {
        this.rendition.on('selected', handleTextSelected);
      }
    }
  }

  // onLocationChange updates the component's state and props when the eBook's location changes.
  onLocationChange = (loc: Location) => {
    const { location, locationChanged } = this.props; // Destructure relevant props.
    const newLocation = `${loc.start}`; // Convert the new location to a string.
    // If the location has changed, update the component's state and call the locationChanged handler.
    if (location !== newLocation) {
      this.location = newLocation; // Update the internal location state.
      // Call the locationChanged prop with the new location.
      if (locationChanged) locationChanged(newLocation);
    }
  };

  // Title: Rendering and Event Handling in EpubView Component
  // Purpose: To define how the EpubView component is rendered to the DOM and handle user interactions like key presses.
  // Explanation:

  // renderBook is a method responsible for rendering the container that will display the eBook content.
  renderBook() {
    // Destructure epubViewStyles from props, using defaultStyles as a fallback if not provided.
    const { epubViewStyles = defaultStyles } = this.props;
    // Return a div element that uses a ref (viewerRef) to allow direct DOM manipulation.
    // The style of this div is set based on epubViewStyles.view, allowing customization of the eBook view.
    return <div ref={this.viewerRef} style={epubViewStyles.view} />;
  }

  // handleKeyPress is an event handler for keyboard events, specifically key presses.
  handleKeyPress = (event: KeyboardEvent) => {
    // If the right arrow key is pressed and a nextPage method exists, call nextPage to go to the next page of the eBook.
    if (event.key === 'ArrowRight' && this.nextPage) {
      this.nextPage();
    }
    // Similarly, if the left arrow key is pressed and a prevPage method exists, call prevPage to go to the previous page.
    if (event.key === 'ArrowLeft' && this.prevPage) {
      this.prevPage();
    }
  };

  // render is the main rendering method of the component, a lifecycle method automatically called by React.
  render() {
    // Destructure isLoaded from the component's state to determine if the eBook has loaded.
    const { isLoaded } = this.state;
    // Destructure loadingView and epubViewStyles from props, providing default values where necessary.
    const { loadingView = null, epubViewStyles = defaultStyles } = this.props;
    // Return a div that acts as the container for the eBook viewer.
    // This div's style is determined by epubViewStyles.viewHolder.
    // Inside this div, conditionally render either the eBook content (by calling renderBook) or a loading view,
    // depending on whether the eBook isLoaded.
    return (
      <div style={epubViewStyles.viewHolder}>
        {(isLoaded && this.renderBook()) || loadingView}
      </div>
    );
  }
}
