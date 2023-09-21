import { useState } from "react"
import Button from "../button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../dialog";
import { Label } from "../label";
import { Input } from "../input";
import { GripVertical, X } from "lucide-react";

const LanguageDropdown = () => {
  // to store & manage the languages list
  const [languageList, setLanguageList] = useState<LanguageItemDataType[]>([]);
  // to manage the input for adding new languages
  const [newLanguageInput, setNewLanguageInput] = useState<string>("");

  // Method to manage the input changes in the newLanguage flow
  const handleNewLanguageInput = (inputString: string) => {
    setNewLanguageInput(inputString);
  };

  return (
    <div className="w-[820px] h-auto rounded-lg border border-neutral-200 p-4">
      <div className="flex flex-row items-center justify-between">
        <p className="leading-snug font-normal text-sm text-neutral-500 tracking-tight">
          {"The skills you mention here will help hackathon organizers in assessing you as a potential participant."}
        </p>
        {/* Dialog component for taking inputs for new languages */}
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
                  onChange={(e) => handleNewLanguageInput(e.target.value as string)}
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-end gap-2">
              <DialogTrigger asChild>
                <Button
                  variant="Outline"
                  onClick={() => setNewLanguageInput("")}
                >
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
                        position: languageList.length + 1
                      }
                    ])
                  }}
                >
                  Save language
                </Button>
              </DialogTrigger>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="languages-list-container my-4 grid grid-cols-2 gap-4">
        {languageList?.map((language, languageIndex) => {
          return (
            <LanguageItem
              data={language}
              languageList={languageList}
              setLanguageList={setLanguageList}
              key={languageIndex}
            />
          )
        })}
      </div>
    </div>
  )
};

const LanguageItem: React.FunctionComponent<LanguageItemProps> = ({ data, languageList, setLanguageList }) => {
  return (
    <div className="language-item p-4 shadow-lg rounded-lg bg-gradient-to-t from-neutral-900 to-neutral-700 flex flex-row items-center justify-between">
      <div className="language-item-content-wrapper font-medium text-lg text-neutral-100">
        {data.title}
      </div>
      <div className="flex flex-row items-center justify-end gap-2">
        <GripVertical color="rgb(163 163 163)" />
        <Button variant="Outline" className="p-2 bg-neutral-700 border-transparent hover:bg-neutral-700/60">
          <X color="rgb(163 163 163)" />
        </Button>
      </div>
    </div>
  )
}

export default LanguageDropdown;