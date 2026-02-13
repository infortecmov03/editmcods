// src/ui/components/editor/cursor-utils.ts

/**
 * Calculates the cursor's character offset from the start of an element.
 * This is used to get a serializable cursor position from the DOM.
 * @param element The container element.
 * @returns The character offset of the cursor.
 */
export function getCursorOffset(element: Node): number {
  let offset = 0;
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    // Create a range that spans from the start of the element to the cursor
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    // The length of the text content of this range is the offset
    offset = preCaretRange.toString().length;
  }
  return offset;
}

/**
 * Sets the cursor's position within an element based on a character offset.
 * This is used to restore the cursor position after the DOM has been re-rendered.
 * @param element The container element.
 * @param offset The character offset to place the cursor at.
 */
export function setCursorOffset(element: Node, offset: number) {
  const range = document.createRange();
  const selection = window.getSelection();
  let charCount = 0;

  // Create a node iterator to traverse only the text nodes
  const nodeIterator = document.createNodeIterator(element, NodeFilter.SHOW_TEXT);
  let node;

  while ((node = nodeIterator.nextNode())) {
    const nodeLength = node.nodeValue?.length ?? 0;
    if (charCount + nodeLength >= offset) {
      // We found the text node that contains the offset
      const finalOffset = offset - charCount;
      range.setStart(node, finalOffset);
      range.collapse(true); // Collapse the range to a single point

      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
      return; // Exit once the cursor is set
    }
    charCount += nodeLength;
  }

  // If the offset is at the very end of the content, place the cursor
  // at the end of the last text node.
  const lastNode = nodeIterator.previousNode() || element.lastChild;
  if (lastNode) {
    range.setStart(lastNode, lastNode.nodeValue?.length ?? 0);
    range.collapse(true);
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
}
