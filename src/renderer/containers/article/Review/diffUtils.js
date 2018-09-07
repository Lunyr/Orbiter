import { EditorState, ContentState, ContentBlock, CharacterMetadata } from 'draft-js';
import { editorStateToJSON } from 'megadraft';
import OrderedHashMap from 'ordered-hashmap';
import { List, OrderedSet } from 'immutable';
import decorator from '../../../components/MegadraftEditor/decorator';

export const contentBlockDiff = (anchorKey, oldContentBlock, newContentBlock) => {
  const oldText = JSON.parse(JSON.stringify(oldContentBlock));
  const newText = JSON.parse(JSON.stringify(newContentBlock));
  const reviewBlockChars = [];
  let reviewText = '';
  let reviewType = 'unstyled';
  let reviewBlock = null;
  let contentType = null;

  if (!oldContentBlock) {
    // CONTENT BLOCK WAS ADDED
    reviewText = newContentBlock.getText();
    contentType = newContentBlock.getType();
    if (contentType === 'atomic') {
      reviewBlock = newContentBlock;
    } else {
      for (let i = 0; i < reviewText.length; i++) {
        const character = CharacterMetadata.create({
          style: OrderedSet.of('NEWTEXT'),
          entity: newText.characterList[i].entity,
        });
        reviewBlockChars.push(character);
      }

      reviewBlock = new ContentBlock({
        key: anchorKey,
        text: reviewText,
        characterList: List(reviewBlockChars),
      });
    }
  } else if (!newContentBlock) {
    // CONTENT BLOCK WAS DELTETED
    reviewText = oldContentBlock.getText();

    contentType = oldContentBlock.getType();

    if (contentType === 'atomic') {
      reviewBlock = newContentBlock;
    } else {
      // eslint-disable-next-line
      for (let i = 0; i < reviewText.length; i++) {
        // eslint-disable-next-line
        let character = CharacterMetadata.create({
          style: OrderedSet.of('STRIKETHROUGH'),
          entity: oldText.characterList[i].entity,
        });
        reviewBlockChars.push(character);
      }

      reviewBlock = new ContentBlock({
        key: anchorKey,
        text: reviewText,
        characterList: List(reviewBlockChars),
      });
    }
  } else {
    // CONTENT BLOCKS HAVE THE SAME KEY, RUN DIFF TO SEE THE CHANGES
    contentType = newContentBlock.getType();
    if (contentType === 'atomic') {
      reviewBlock = newContentBlock;
    } else {
      const differ = require('diff');
      const diff = differ.diffSentences(oldContentBlock.getText(), newContentBlock.getText());

      // TODO: maybe make this more efficient, currently o(n^2)
      // eslint-disable-next-line
      for (let i = 0; i < diff.length; i++) {
        //go through each element in diff and find the ones that are removed or added, creates the chars for content block
        let currentChar = 0; //keep track of what character we are editting so we know where to insert the inline style
        for (let j = 0; j < diff[i].value.length; j++) {
          // loop until you reach the length of the text that was removed
          // eslint-disable-next-line
          let character = CharacterMetadata.create();

          if (diff[i].removed) {
            reviewType = oldText.type;
            const style = OrderedSet.of('STRIKETHROUGH');
            if (currentChar < oldText.characterList.length) {
              character = CharacterMetadata.create({
                style: style,
                entity: oldText.characterList[currentChar].entity,
              });
              currentChar++;
            }
          } else if (diff[i].added) {
            reviewType = newText.type;
            // eslint-disable-next-line
            let style = OrderedSet.of('NEWTEXT');
            if (currentChar < newText.characterList.length) {
              character = CharacterMetadata.create({
                style: style,
                entity: newText.characterList[currentChar].entity,
              });
              currentChar++;
            }
          } else {
            currentChar += diff[i].value.length;
          }
          reviewBlockChars.push(character);
        }
        reviewText += diff[i].value;
      }

      reviewBlock = new ContentBlock({
        key: anchorKey,
        text: reviewText,
        type: reviewType,
        characterList: List(reviewBlockChars),
      });
    }
  }

  return reviewBlock;
};

/***
 * Splitting the content block into [oldBlock, newBlock]
 * @params [oldBlockList] -- an array of blocks from the old article
 * @params [newBlockList] -- an array of blocks frmo the new article
 */
export const assembleReviewContentMap = (oldBlockList, newBlockList) => {
  const reviewContentMap = new OrderedHashMap(); // an ordered hashmap of content blocks
  const oldContentKeyArray = [];
  const newContentKeyArray = [];
  let oldContentIndex = 0;
  let newContentIndex = 0;
  let length = 0;

  for (let i = 0; i < oldBlockList.length; i++) {
    oldContentKeyArray[i] = oldBlockList[i].getKey(); //add the old block key to the list
    length++;
  }

  // eslint-disable-next-line
  for (let i = 0; i < newBlockList.length; i++) {
    newContentKeyArray[i] = newBlockList[i].getKey(); //add the new block key to the list
    if (!oldContentKeyArray.includes(newContentKeyArray[i])) {
      // add one to the length if this new key isn't in the old block
      length++;
    }
  }

  // eslint-disable-next-line
  for (let i = 0; i < length; i++) {
    if (oldContentKeyArray[oldContentIndex] !== newContentKeyArray[newContentIndex]) {
      if (!oldContentKeyArray[oldContentIndex]) {
        // if the old content
        reviewContentMap.push(newContentKeyArray[newContentIndex], [
          null,
          newBlockList[newContentIndex],
        ]);
        newContentIndex++;
      } else if (!newContentKeyArray.includes(oldContentKeyArray[oldContentIndex])) {
        reviewContentMap.push(oldContentKeyArray[oldContentIndex], [
          oldBlockList[oldContentIndex],
          null,
        ]);
        oldContentIndex++;
      } else if (!oldContentKeyArray.includes(newContentKeyArray[newContentIndex])) {
        reviewContentMap.push(newContentKeyArray[newContentIndex], [
          null,
          newBlockList[newContentIndex],
        ]);
        newContentIndex++;
      }
    } else {
      const oldBlock =
        oldBlockList[oldContentIndex] === undefined ? null : oldBlockList[oldContentIndex];
      const newBlock =
        newBlockList[newContentIndex] === undefined ? null : newBlockList[newContentIndex];
      if (!oldBlock && !newBlock) {
        continue;
      }
      reviewContentMap.push(oldContentKeyArray[oldContentIndex], [oldBlock, newBlock]);
      oldContentIndex++;
      newContentIndex++;
    }
  }
  return reviewContentMap;
};
/***
 * Calculates the diff and sets megadraft up for review.
 * @param old -- the old megadraft version
 * @param new -- the new megadraft version
 */
export const calculateDiff = (old, newVersion, oldMegadraft, newMegadraft) => {
  let oldMap = [];
  if (old) {
    oldMap = old.getCurrentContent().getBlocksAsArray(); // getting the contentblocks from the old version
  }
  const newBlockList = newVersion.getCurrentContent().getBlocksAsArray(); // getting the contentblocks from the new version
  const reviewContentBlocks = [];

  const reviewContentMap = assembleReviewContentMap(oldMap, newBlockList);

  for (let i = 0; i < reviewContentMap.count(); i++) {
    const anchorKey = reviewContentMap.keyAt(i);
    const oldContentBlock = reviewContentMap.get(anchorKey)[0];
    const newContentBlock = reviewContentMap.get(anchorKey)[1];
    const reviewBlock = contentBlockDiff(anchorKey, oldContentBlock, newContentBlock);
    if (reviewBlock === null) {
      continue;
    }
    reviewContentBlocks.push(reviewBlock);
  }

  let reviewContentState = ContentState.createFromBlockArray(reviewContentBlocks);
  if (newMegadraft) {
    for (const key in newMegadraft.entityMap) {
      if (newMegadraft.entityMap.hasOwnProperty(key)) {
        const entity = newMegadraft.entityMap[key];
        reviewContentState = reviewContentState.createEntity(
          entity.type,
          entity.mutability,
          entity.data
        );
      }
    }
  }

  if (oldMegadraft) {
    for (const key in oldMegadraft.entityMap) {
      if (oldMegadraft.entityMap.hasOwnProperty(key)) {
        const entity = oldMegadraft.entityMap[key];
        reviewContentState = reviewContentState.createEntity(
          entity.type,
          entity.mutability,
          entity.data
        );
      }
    }
  }

  return JSON.parse(
    editorStateToJSON(EditorState.createWithContent(reviewContentState, decorator))
  );
};
