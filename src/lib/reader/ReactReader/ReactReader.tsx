/* eslint-disable */
/*
 * Import Statements for a React eBook Reader Component - includes handling user interactions like swiping, rendering eBook content, and applying custom styles.
 */

import React, {
  type CSSProperties,
  PureComponent,
  type ReactNode,
} from 'react';
import { type SwipeableProps, useSwipeable } from 'react-swipeable';
import { EpubView, type IEpubViewStyle, type IEpubViewProps } from '..'; // A custom component utilizing 'epubjs' for rendering eBook with associated style and prop types.
import {
  ReactReaderStyle as defaultStyles,
  type IReactReaderStyle,
} from './style'; // Default styles for the eBook reader which allows for styling customization and ensures the styles adhere to a specific structure for consistency.
import { type NavItem } from 'epubjs'; // Type for `NavItem` from 'epubjs' is imported, likely representing navigational items within the eBook, such as chapters or sections, indicating an interaction with the eBook's table of contents.

type SwipeWrapperProps = {
  children: ReactNode;
  swipeProps: Partial<SwipeableProps>;
};

const SwipeWrapper = ({ children, swipeProps }: SwipeWrapperProps) => {
  const handlers = useSwipeable(swipeProps);
  return <div {...handlers}>{children}</div>;
};

type TocItemProps = {
  data: NavItem;
  setLocation: (value: string) => void;
  styles?: CSSProperties;
};

/*
 * Table of Contents Component
 ** Renders an item in the Table of Contents (ToC) and supports nested ToC items.
 **
 * Props:
 ** - data: Object representing a ToC item (Chapter). Contains:
 **   - label: String. The display text for the ToC item (e.g., chapter title).
 **   - href: String. The link to the section in the eBook.
 **   - subitems: Array. Optional. Nested ToC entries under the current item.
 ** - setLocation: Function. Called with a URL or fragment identifier (href) to navigate the eBook viewer to that section.
 ** - styles: CSSProperties. Optional. Custom styles for the ToC item button.
 **
 * Recursive Rendering:
 ** - The component leverages recursion to render not just the top-level ToC items but also any nested subitems, creating a hierarchical ToC structure. This is particularly useful for eBooks with chapters, sections, and subsections.
 ** - For each ToC entry that contains subitems, the TocItem component calls itself for each subitem, passing the same setLocation function and styles props. This process repeats for each level of nesting, allowing for an unlimited depth of ToC hierarchy.
 **
 * Example Usage:
 ** Renders a ToC entry ("Chapter 1") with a button. If "Chapter 1" has subsections,
 ** additional TocItem components are rendered for each, all capable of updating the eBook viewer's location when clicked.
 */
const TocItem = ({ data, setLocation, styles }: TocItemProps) => (
  <div>
    {/* A button that navigates the eBook viewer to the corresponding section. */}
    <button onClick={() => setLocation(data.href)} style={styles}>
      {data.label}{' '}
      {/* Displays the label of the ToC item. This label is typically the title of the chapter or section. */}
    </button>
    {/* Multi-level Nesting: Conditional rendering checks if there are subitems. If there are, it renders them in a nested <div>. */}
    {data.subitems && data.subitems.length > 0 && (
      <div style={{ paddingLeft: 10 }}>
        {data.subitems.map((item, i) => (
          <TocItem
            key={i} // React requires a unique key for list items. Index is used here, but a more stable identifier is recommended for larger lists.
            data={item} // Passes the subitem data to the recursive TocItem component.
            styles={styles} // Inherits styles from the parent ToC item, ensuring consistent styling.
            setLocation={setLocation} // Passes the setLocation function down to allow nested items to control eBook navigation.
          />
        ))}
      </div>
    )}
  </div>
);

export type IReactReaderProps = IEpubViewProps & {
  title?: string;
  showToc?: boolean;
  readerStyles?: IReactReaderStyle;
  epubViewStyles?: IEpubViewStyle;
  swipeable?: boolean;
};

type IReactReaderState = {
  isLoaded: boolean;
  expandedToc: boolean;
  toc: NavItem[];
};

export class ReactReader extends PureComponent<
  IReactReaderProps,
  IReactReaderState
> {
  state: Readonly<IReactReaderState> = {
    isLoaded: false,
    expandedToc: false,
    toc: [],
  };
  readerRef = React.createRef<EpubView>();
  constructor(props: IReactReaderProps) {
    super(props);
  }
  toggleToc = () => {
    this.setState({
      expandedToc: !this.state.expandedToc,
    });
  };

  next = () => {
    const node = this.readerRef.current;
    if (node && node.nextPage) {
      node.nextPage();
    }
  };

  prev = () => {
    const node = this.readerRef.current;
    if (node && node.prevPage) {
      node.prevPage();
    }
  };

  onTocChange = (toc: NavItem[]) => {
    const { tocChanged } = this.props;
    this.setState(
      {
        toc: toc,
      },
      () => tocChanged && tocChanged(toc)
    );
  };

  renderToc() {
    const { toc, expandedToc } = this.state;
    const { readerStyles = defaultStyles } = this.props;
    return (
      <div>
        <div style={readerStyles.tocArea}>
          <div style={readerStyles.toc}>
            {toc.map((item, i) => (
              <TocItem
                data={item}
                key={i}
                setLocation={this.setLocation}
                styles={readerStyles.tocAreaButton}
              />
            ))}
          </div>
        </div>
        {expandedToc && (
          <div style={readerStyles.tocBackground} onClick={this.toggleToc} />
        )}
      </div>
    );
  }

  setLocation = (loc: string) => {
    const { locationChanged } = this.props;
    this.setState(
      {
        expandedToc: false,
      },
      () => locationChanged && locationChanged(loc)
    );
  };

  renderTocToggle() {
    const { expandedToc } = this.state;
    const { readerStyles = defaultStyles } = this.props;
    return (
      <button
        style={Object.assign(
          {},
          readerStyles.tocButton,
          expandedToc ? readerStyles.tocButtonExpanded : {}
        )}
        onClick={this.toggleToc}
      >
        <span
          style={Object.assign(
            {},
            readerStyles.tocButtonBar,
            readerStyles.tocButtonBarTop
          )}
        />
        <span
          style={Object.assign(
            {},
            readerStyles.tocButtonBar,
            readerStyles.tocButtonBottom
          )}
        />
      </button>
    );
  }

  render() {
    const {
      title,
      showToc = true,
      loadingView,
      readerStyles = defaultStyles,
      locationChanged,
      swipeable,
      epubViewStyles,
      ...props
    } = this.props;
    const { toc, expandedToc } = this.state;
    return (
      <div style={readerStyles.container}>
        <div
          style={Object.assign(
            {},
            readerStyles.readerArea,
            expandedToc ? readerStyles.containerExpanded : {}
          )}
        >
          {showToc && this.renderTocToggle()}
          <div style={readerStyles.titleArea}>{title}</div>
          <SwipeWrapper
            swipeProps={{
              onSwipedRight: this.prev,
              onSwipedLeft: this.next,
              trackMouse: true,
            }}
          >
            <div style={readerStyles.reader}>
              <EpubView
                ref={this.readerRef}
                loadingView={
                  loadingView === undefined ? (
                    <div style={readerStyles.loadingView}>Loading…</div>
                  ) : (
                    loadingView
                  )
                }
                epubViewStyles={epubViewStyles}
                {...props}
                tocChanged={this.onTocChange}
                locationChanged={locationChanged}
              />
              {swipeable && <div style={readerStyles.swipeWrapper} />}
            </div>
          </SwipeWrapper>
          <button
            style={Object.assign({}, readerStyles.arrow, readerStyles.prev)}
            onClick={this.prev}
          >
            ‹
          </button>
          <button
            style={Object.assign({}, readerStyles.arrow, readerStyles.next)}
            onClick={this.next}
          >
            ›
          </button>
        </div>
        {showToc && toc && this.renderToc()}
      </div>
    );
  }
}
