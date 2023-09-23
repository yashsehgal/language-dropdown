/**
 * 
 * TODO: Update current input component with react-select
 * TODO: Remove filter and apply controlled API calls for language recommendations
 * TODO: Make the change to 10 slots as shown in the GIF
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

import Skeleton from 'react-loading-skeleton';

import {
  fetchLanguageList,
  updateLanguageItemRemovalOnFirebase,
  updateLanguageItemReorderOnFirebase,
  updateLanguageList,
} from '../../utils/firebase-helpers';

import { recommendLanguages } from '../../utils/recommendLanguages';
import { cn } from '../../utils/cn';

const LanguageDropdown = () => {
  // to store & manage the languages list
  const [languageList, setLanguageList] = useState<LanguageItemDataType[]>([]);
  // to manage the input for adding new languages
  const [newLanguageInput, setNewLanguageInput] = useState<string>('');
  // to manage the state with there's no data from firebase and local array.
  const [hasNoData, setHasNoData] = useState<boolean>(true);
  // to manage the langauge recommendations array.
  const [recommendations, setRecommendations] = useState<RecommendationType[]>([]);

  // Method to manage the input changes in the newLanguage flow
  const handleNewLanguageInput = async (inputString: string) => {
    // when the input string is null, reset all the language recommendations
    if (!inputString) setRecommendations([]);
    setNewLanguageInput(inputString);
    // Rendering recommendations...
    handleRecommendations(inputString);
  };

  // To handle the recommendations
  const handleRecommendations = async (inputString: string = "") => {
    // Do nothing when the new input string of language is empty.
    if (!newLanguageInput) return;
    // If not, then fetch & filter the recommendations
    let _recommendations: RecommendationType[] = (await recommendLanguages(inputString)) as any;
    _recommendations = await _recommendations.filter((languageItem: RecommendationType) => {
      if (
        languageItem.label.includes(newLanguageInput) ||
        languageItem.label.startsWith(newLanguageInput)
      ) {
        return languageItem;
      }
    });
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
  };

  // Works in sync with the above method {reloadLanguageList}
  // Checks if the languageList is empty,
  // if yes → show empty list text
  useEffect(() => {
    if (!languageList) setHasNoData(true);
    (async () => {
      let _preloadLanguageListData = await fetchLanguageList();
      setLanguageList(_preloadLanguageListData);
      setHasNoData(false);
    })();
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
    <div className="w-[820px] h-auto rounded-lg border border-neutral-200 p-4">
      <div className="flex flex-row items-center justify-between">
        <p className="leading-snug font-normal text-sm text-neutral-500 tracking-tight">
          {
            'The skills you mention here will help hackathon organizers in assessing you as a potential participant.'
          }
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add language</Button>
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
                />
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
                    setNewLanguageInput('');
                    setRecommendations([]);
                  }}>
                  Save language
                </Button>
              </DialogTrigger>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div
        className={cn(
          'languages-list-container my-4 gap-4',
          languageList.length ? 'columns-2' : 'grid grid-cols-2',
        )}>
        {languageList.length ? (
          languageList.map((language, languageIndex) => {
            return (
              <LanguageItem
                data={language}
                languageList={languageList}
                setLanguageList={setLanguageList}
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
        ) : !hasNoData ? (
          <div className="text-center select-none my-2 text-neutral-400">
            No data found. Start adding languages in your skills
          </div>
        ) : (
          <>
            <Skeleton containerClassName="w-full" height={'73px'} />
            <Skeleton containerClassName="w-full" height={'73px'} />
          </>
        )}
      </div>
    </div>
  );
};

const LanguageItem: React.FunctionComponent<
  LanguageItemProps & React.HTMLAttributes<HTMLDivElement>
> = ({ data, languageList, setLanguageList, ...props }) => {
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
      className="mb-4 language-item p-4 shadow-lg rounded-lg bg-gradient-to-t from-neutral-900 to-neutral-700 flex flex-row items-center justify-between"
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
