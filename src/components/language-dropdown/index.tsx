/**
 *
 * TODO: Fix constantly happening API calls to firebase.firestore
 */

import React, { useEffect, useRef, useState } from 'react';

import Button from '../button';
import { Label } from '../label';
import { Input } from '../input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../dialog';

import { GripVertical, X } from 'lucide-react';

import {
  fetchLanguageList,
  updateLanguageItemRemovalOnFirebase,
  updateLanguageItemReorderOnFirebase,
  updateLanguageList,
} from '../../utils/firebase-helpers';

import { recommendLanguages } from '../../utils/recommendLanguages';
import { cn } from '../../utils/cn';
import Skeleton from 'react-loading-skeleton';

const LanguageDropdown = () => {
  // to store & manage the languages list
  const [languageList, setLanguageList] = useState<LanguageItemDataType[]>([]);
  // to manage the input for adding new languages
  const [newLanguageInput, setNewLanguageInput] = useState<string>('');
  // to manage the state with there's no data from firebase and local array.
  const [hasNoData, setHasNoData] = useState<boolean>(true);
  // to manage the langauge recommendations array.
  const [recommendations, setRecommendations] = useState<RecommendationType[]>([]);

  // to manage the placeholder array in the list
  const [placeholderList, setPlaceholderList] = useState<string[]>(
    languageList.length !== 10 && languageList.length !== 9
      ? new Array(9 - languageList.length).fill('')
      : [],
  );

  // Method to manage the input changes in the newLanguage flow
  const handleNewLanguageInput = (inputString: any) => {
    setNewLanguageInput(inputString);
  };

  // Blocking API requests as the time-limit is exceeding...
  useEffect(() => {
    // Rendering recommendations...
    handleRecommendations(newLanguageInput);
  }, [newLanguageInput])

  // To handle the recommendations
  const handleRecommendations = async (inputString: string = '') => {
    // Do nothing when the new input string of language is empty.
    if (!newLanguageInput) return;
    // If not, then fetch & filter the recommendations
    let _recommendations: RecommendationType[] = (await recommendLanguages(
      inputString.toLowerCase() as string,
    )) as any;
    _recommendations = await _recommendations.filter(
      (languageItem: RecommendationType) => {
        if (
          languageItem.label.includes(newLanguageInput) ||
          languageItem.label.startsWith(newLanguageInput)
        ) {
          return languageItem;
        }
      },
    );
    setRecommendations(_recommendations);
  };

  // To manage the preload when the UI renders
  // Fetches data from firebase...
  useEffect(() => {
    (async () => {
      let _preloadLanguageListData = await fetchLanguageList();
      setLanguageList(_preloadLanguageListData);
      setHasNoData(false);
    })();
  }, []);

  // Method to set the placeholders state
  // - Has data but loading → show skeleton loading
  // - Has no data still loading → show empty list text
  const reloadLanguageList = async () => {
    let _preloadLanguageListData = await fetchLanguageList();
    if (_preloadLanguageListData.length === 0) {
      setHasNoData(true);
    }
    setLanguageList(_preloadLanguageListData);
    setPlaceholderList(new Array(9 - languageList.length).fill(''));
  };

  // Works in sync with the above method {reloadLanguageList}
  // Checks if the languageList is empty,
  // if yes → show empty list text
  useEffect(() => {
    languageList.length !== 10
      ? setPlaceholderList(new Array(9 - languageList.length).fill(''))
      : setPlaceholderList([]);
  }, [languageList]);

  // References for the dragged item and item to replace with
  const dragItem = useRef<any>(null);
  const dragOverItem = useRef<any>(null);

  // method to handle sorting while dragging is ending;
  const handleLanguageItemsRearrange = (e: React.DragEvent<HTMLDivElement>) => {
    // Copying the languageItems list
    let _languageList = [...languageList];

    // remove and save the dragged languageItem
    const draggedItemsContent = _languageList.splice(dragItem.current, 1)[0];

    // switching the positions of dragged item
    // and the item where it is dropped
    _languageList.splice(dragOverItem.current, 0, draggedItemsContent);

    // Updating the reordered languageList on local UI & firebase.
    _languageList.map(
      (languageItem: LanguageItemDataType, languageIndex: number) => {
        if (languageItem.position !== languageIndex) {
          languageItem.position = languageIndex;
          updateLanguageItemReorderOnFirebase(
            languageItem,
            languageItem.id as string,
          );
        }
      },
    );

    // Reseting references for later drag events
    dragItem.current = null;
    dragOverItem.current = null;

    // refresh the main languageList
    setLanguageList(_languageList);

    // To prevent the firebase and local state renders.
    e.preventDefault();
  };

  return (
    <div className="w-[820px] h-auto rounded-lg border border-neutral-200 p-4 shadow-inner shadow-neutral-200/60">
      <div className="flex flex-row items-center justify-between">
        <p className="leading-snug font-normal text-sm text-neutral-500 tracking-tight">
          {
            'The skills you mention here will help hackathon organizers in assessing you as a potential participant.'
          }
        </p>
      </div>
      <div
        className={cn(
          'languages-list-container my-4 gap-4',
          // languageList.length ? 'columns-2' : 'grid grid-cols-2',
          'columns-2',
        )}>
        {languageList.length
          ? languageList.map((language, languageIndex) => {
            return (
              <LanguageItem
                data={language}
                languageList={languageList}
                setLanguageList={setLanguageList}
                // Sending placeholder list...
                placeholderList={placeholderList}
                setPlaceholderList={setLanguageList}
                key={languageIndex}
                draggable
                onDragStart={() => (dragItem.current = languageIndex)}
                onDragEnter={() => (dragOverItem.current = languageIndex)}
                onDragEnd={handleLanguageItemsRearrange}
                onDragOver={(e) => {
                  // This will manage the state change after the drag event is over.
                  e.preventDefault();
                }}
              />
            );
          })
          : hasNoData && (
            <></>
          )}
        {/* Rendering add more languages block */}
        {languageList.length !== 10 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="Solid"
                className={cn(
                  'mb-4 w-full h-[73px] p-4 shadow-2xl text-lg font-medium rounded-lg bg-gradient-to-t from-neutral-900 to-neutral-700 opacity-60 hover:opacity-70 flex flex-row items-center justify-between',
                )}>
                Add language
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add new Language as skill</DialogTitle>
              </DialogHeader>
              <div className="dialog-content-body">
                <div className="language-name-input-wrapper">
                  <Label htmlFor="new-language-name">Language name</Label>
                  <Input
                    id="new-language-name"
                    type="text"
                    placeholder="Javascript, Python, NodeJS..."
                    className="mt-2"
                    value={newLanguageInput}
                    onChange={(e) =>
                      handleNewLanguageInput(e.target.value as string)
                    }
                    list="language-recommendations"
                  />
                  <datalist id="language-recommendations">
                    {recommendations.map((recommendation, recommendationIndex) => {
                      return (
                        <option value={recommendation.value} key={recommendationIndex}>
                          {recommendation.value}
                        </option>
                      )
                    })}
                  </datalist>
                </div>
              </div>
              <div className="flex flex-row items-center justify-end gap-2">
                <DialogTrigger asChild>
                  <Button
                    variant="Outline"
                    onClick={() => {
                      // Reseting states for next time...
                      reloadLanguageList();
                      setNewLanguageInput('');
                    }}>
                    Discard
                  </Button>
                </DialogTrigger>
                <DialogTrigger asChild>
                  <Button
                    className="w-fit"
                    onClick={() => {
                      // do nothing if no new language input is added
                      if (!newLanguageInput) return;
                      // if found input data for new language; update the languageList
                      setLanguageList([
                        ...languageList,
                        {
                          title: newLanguageInput,
                          position: languageList.length,
                        },
                      ]);
                      // updating the data on firebase > firestore
                      updateLanguageList({
                        title: newLanguageInput,
                        position: languageList.length,
                      });

                      // Reseting the new input language data for later...
                      setRecommendations([]);
                      setNewLanguageInput('');
                    }}>
                    Save language
                  </Button>
                </DialogTrigger>
              </div>
            </DialogContent>
          </Dialog>
        )}
        {placeholderList.map((placeholder, index) => {
          if (index >= 9) {
            <>Invalid render</>;
          } else {
            return (
              <Button
                variant="Solid"
                className={cn(
                  'mb-4 w-full h-[73px] p-4 cursor-not-allowed shadow-2xl text-lg font-medium rounded-lg bg-gradient-to-t from-neutral-900 to-neutral-700 opacity-20 flex flex-row items-center justify-between',
                )}
                draggable>
                Add language
              </Button>
            );
          }
        })}
      </div>
    </div >
  );
};

const LanguageItem: React.FunctionComponent<
  LanguageItemProps & React.HTMLAttributes<HTMLDivElement>
> = ({
  data,
  languageList,
  setLanguageList,
  placeholderList,
  setPlaceholderList,
  ...props
}) => {
    // Method to remove a language item from the list.
    const handleLanguageItemRemoval = (position: number) => {
      // Copy of the languageList array
      // @ts-ignore
      let _languageList: LanguageItemDataType[] = [...languageList];
      // Filtering the copy array for the languageItem removal at "position"
      _languageList = _languageList.filter(
        (languageItem: LanguageItemDataType, languageIndex) => {
          if (languageIndex !== position) {
            return languageItem;
          }
        },
      );
      // After the removal of languageItem at position, we have to traverse
      // and replace the positions with new locations (i.e. "currentLocations" - 1).
      _languageList.map((languageItem, languageIndex) => {
        languageItem.position = languageIndex;
      });
      setLanguageList(_languageList);
      updateLanguageItemRemovalOnFirebase(data.id as string);
    };

    return (
      <div
        className="mb-4 language-item p-4 shadow-2xl rounded-lg bg-gradient-to-t from-neutral-900 to-neutral-700 flex flex-row items-center justify-between"
        {...props}>
        <div className="language-item-content-wrapper font-medium text-lg text-neutral-100">
          {data.title}
        </div>
        <div className="flex flex-row items-center justify-end gap-2">
          <GripVertical color="rgb(163 163 163)" className="cursor-grab" />
          <Button
            variant="Outline"
            className="p-2 bg-neutral-700 border-transparent hover:bg-neutral-700/60"
            onClick={() => handleLanguageItemRemoval(data.position)}>
            <X color="rgb(163 163 163)" />
          </Button>
        </div>
      </div>
    );
  };

export default LanguageDropdown;
