// TODO: this is just to have the proper font, maybe there is a better way than overriding all the rules

// overriding https://github.com/iamacup/react-native-markdown-display/blob/master/src/lib/renderRules.js
import {
  // Text as MyText,
  TouchableWithoutFeedback,
  View,
  Platform,
  StyleSheet,
  Linking,
} from 'react-native';

import MyText from '~/components/ui/my-text';
import { DynamicHeightImage } from '~/components/dynamic-height-image';

function openUrl(url, customCallback) {
  if (customCallback) {
    const result = customCallback(url);
    if (url && result && typeof result === 'boolean') {
      Linking.openURL(url);
    }
  } else if (url) {
    Linking.openURL(url);
  }
}
const textStyleProps = [
  'textShadowOffset',
  'color',
  'fontSize',
  'fontStyle',
  'fontWeight',
  'lineHeight',
  'textAlign',
  'textDecorationLine',
  'textShadowColor',
  'fontFamily',
  'textShadowRadius',
  'includeFontPadding',
  'textAlignVertical',
  'fontVariant',
  'letterSpacing',
  'textDecorationColor',
  'textDecorationStyle',
  'textTransform',
  'writingDirection',
];

function hasParents(parents, type) {
  return parents.findIndex((el) => el.type === type) > -1;
}

const renderRules = {
  // when unknown elements are introduced, so it wont break
  unknown: (node, children, parent, styles) => null,

  // The main container
  body: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_body}>
      {children}
    </View>
  ),

  // Headings
  heading1: (node, children, parent, styles) => {
    return (
      <View key={node.key} style={styles._VIEW_SAFE_heading1}>
        {children}
      </View>
    );
  },
  heading2: (node, children, parent, styles) => {
    return (
      <View key={node.key} style={styles._VIEW_SAFE_heading2}>
        {children}
      </View>
    );
  },
  heading3: (node, children, parent, styles) => {
    return (
      <View key={node.key} style={styles._VIEW_SAFE_heading3}>
        {children}
      </View>
    );
  },
  heading4: (node, children, parent, styles) => {
    return (
      <View key={node.key} style={styles._VIEW_SAFE_heading4}>
        {children}
      </View>
    );
  },
  heading5: (node, children, parent, styles) => {
    return (
      <View key={node.key} style={styles._VIEW_SAFE_heading5}>
        {children}
      </View>
    );
  },
  heading6: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_heading6}>
      {children}
    </View>
  ),

  // Horizontal Rule
  hr: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_hr} />
  ),

  // Emphasis
  strong: (node, children, parent, styles) => {
    return (
      <MyText key={node.key} style={{ fontFamily: 'MarianneBold' }}>
        {children}
      </MyText>
    );
  },
  em: (node, children, parent, styles) => (
    <MyText
      key={node.key}
      style={{ ...styles.em, fontFamily: 'MarianneRegularItalic' }}
    >
      {children}
    </MyText>
  ),
  s: (node, children, parent, styles) => (
    <MyText key={node.key} style={styles.s}>
      {children}
    </MyText>
  ),

  // Blockquotes
  blockquote: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_blockquote}>
      {children}
    </View>
  ),

  // Lists
  bullet_list: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_bullet_list}>
      {children}
    </View>
  ),
  ordered_list: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_ordered_list}>
      {children}
    </View>
  ),
  // this is a unique and quite annoying render rule because it has
  // child items that can be styled (the list icon and the list content)
  // outside of the AST tree so there are some work arounds in the
  // AST renderer specifically to get the styling right here
  list_item: (node, children, parent, styles, inheritedStyles = {}) => {
    // we need to grab any text specific stuff here that is applied on the list_item style
    // and apply it onto bullet_list_icon. the AST renderer has some workaround code to make
    // the content classes apply correctly to the child AST tree items as well
    // as code that forces the creation of the inheritedStyles object for list_items
    const refStyle = {
      ...inheritedStyles,
      ...StyleSheet.flatten(styles.list_item),
    };

    const arr = Object.keys(refStyle);

    const modifiedInheritedStylesObj = {};

    for (let b = 0; b < arr.length; b++) {
      if (textStyleProps.includes(arr[b])) {
        modifiedInheritedStylesObj[arr[b]] = refStyle[arr[b]];
      }
    }

    if (hasParents(parent, 'bullet_list')) {
      return (
        <View key={node.key} style={styles._VIEW_SAFE_list_item}>
          <MyText
            style={[modifiedInheritedStylesObj, styles.bullet_list_icon]}
            accessible={false}
          >
            {Platform.select({
              android: '\u2022',
              ios: '\u00B7',
              default: '\u2022',
            })}
          </MyText>
          <View style={styles._VIEW_SAFE_bullet_list_content}>{children}</View>
        </View>
      );
    }

    if (hasParents(parent, 'ordered_list')) {
      const orderedListIndex = parent.findIndex(
        (el) => el.type === 'ordered_list',
      );

      const orderedList = parent[orderedListIndex];
      let listItemNumber;

      if (orderedList.attributes?.start) {
        listItemNumber = orderedList.attributes.start + node.index;
      } else {
        listItemNumber = node.index + 1;
      }

      return (
        <View key={node.key} style={styles._VIEW_SAFE_list_item}>
          <MyText
            style={[modifiedInheritedStylesObj, styles.ordered_list_icon]}
          >
            {listItemNumber}
            {node.markup}
          </MyText>
          <View style={styles._VIEW_SAFE_ordered_list_content}>{children}</View>
        </View>
      );
    }

    // we should not need this, but just in case
    return (
      <View key={node.key} style={styles._VIEW_SAFE_list_item}>
        {children}
      </View>
    );
  },

  // Code
  code_inline: (node, children, parent, styles, inheritedStyles = {}) => (
    <MyText key={node.key} style={[inheritedStyles, styles.code_inline]}>
      {node.content}
    </MyText>
  ),
  code_block: (node, children, parent, styles, inheritedStyles = {}) => {
    // we trim new lines off the end of code blocks because the parser sends an extra one.
    let { content } = node;

    if (
      typeof node.content === 'string' &&
      node.content.charAt(node.content.length - 1) === '\n'
    ) {
      content = node.content.substring(0, node.content.length - 1);
    }

    return (
      <MyText key={node.key} style={[inheritedStyles, styles.code_block]}>
        {content}
      </MyText>
    );
  },
  fence: (node, children, parent, styles, inheritedStyles = {}) => {
    // we trim new lines off the end of code blocks because the parser sends an extra one.
    let { content } = node;

    if (
      typeof node.content === 'string' &&
      node.content.charAt(node.content.length - 1) === '\n'
    ) {
      content = node.content.substring(0, node.content.length - 1);
    }

    return (
      <MyText key={node.key} style={[inheritedStyles, styles.fence]}>
        {content}
      </MyText>
    );
  },

  // Tables
  table: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_table}>
      {children}
    </View>
  ),
  thead: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_thead}>
      {children}
    </View>
  ),
  tbody: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_tbody}>
      {children}
    </View>
  ),
  th: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_th}>
      {children}
    </View>
  ),
  tr: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_tr}>
      {children}
    </View>
  ),
  td: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_td}>
      {children}
    </View>
  ),

  // Links
  link: (node, children, parent, styles, onLinkPress) => (
    <MyText
      key={node.key}
      style={styles.link}
      onPress={() => {
        openUrl(node.attributes.href, onLinkPress);
      }}
    >
      {children}
    </MyText>
  ),
  blocklink: (node, children, parent, styles, onLinkPress) => (
    <TouchableWithoutFeedback
      key={node.key}
      onPress={() => {
        openUrl(node.attributes.href, onLinkPress);
      }}
      style={styles.blocklink}
    >
      <View style={styles.image}>{children}</View>
    </TouchableWithoutFeedback>
  ),

  // Images
  image: (
    node,
    children,
    parent,
    styles,
    allowedImageHandlers,
    defaultImageHandler,
  ) => {
    const { src, alt } = node.attributes;

    // we check that the source starts with at least one of the elements in allowedImageHandlers
    const show =
      allowedImageHandlers.filter((value) => {
        return src.toLowerCase().startsWith(value.toLowerCase());
      }).length > 0;

    if (!show && defaultImageHandler === null) {
      return null;
    }

    return (
      <DynamicHeightImage
        key={node.key}
        className="h-96 w-full"
        source={{
          uri: show ? src : `${defaultImageHandler}${src}`,
        }}
        contentFit="contain"
        transition={1000}
        accessibilityLabel={alt}
        accessible={!!alt}
      />
    );
  },

  // MyText Output
  text: (node, children, parent, styles, inheritedStyles = {}) => {
    if (inheritedStyles.fontWeight === 'bold') {
      inheritedStyles.fontFamily = 'MarianneBold';
    } else {
      inheritedStyles.fontFamily = 'MarianneRegular';
    }
    return (
      <MyText key={node.key} style={[inheritedStyles, styles.text]}>
        {node.content}
      </MyText>
    );
  },
  textgroup: (node, children, parent, styles) => (
    <MyText key={node.key} style={styles.textgroup}>
      {children}
    </MyText>
  ),
  paragraph: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_paragraph}>
      {children}
    </View>
  ),
  hardbreak: (node, children, parent, styles) => (
    <MyText key={node.key} style={styles.hardbreak}>
      {'\n'}
    </MyText>
  ),
  softbreak: (node, children, parent, styles) => (
    <MyText key={node.key} style={styles.softbreak}>
      {'\n'}
    </MyText>
  ),

  // Believe these are never used but retained for completeness
  pre: (node, children, parent, styles) => (
    <View key={node.key} style={styles._VIEW_SAFE_pre}>
      {children}
    </View>
  ),
  inline: (node, children, parent, styles) => (
    <MyText key={node.key} style={styles.inline}>
      {children}
    </MyText>
  ),
  span: (node, children, parent, styles) => (
    <MyText key={node.key} style={styles.span}>
      {children}
    </MyText>
  ),
  sup: (node, children, parent, styles) => {
    return (
      <View style={styles.supContainer}>
        <MyText key={node.key} style={styles.sup}>
          {children}
        </MyText>
      </View>
    );
  },
  sub: (node, children, parent, styles) => {
    return (
      <MyText key={node.key} style={styles.sub}>
        {children}
      </MyText>
    );
  },
};

export default renderRules;
