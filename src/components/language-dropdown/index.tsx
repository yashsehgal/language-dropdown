import { useEffect, useState } from "react";
import { LanguageItemProps } from "./types";
import { cn } from "../../utils/cn";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../command-select";
import Button from "../button";
import { Grip } from "lucide-react";

const LanguageDropdown: React.FunctionComponent = () => {
  const [addedLanguages, setAddedLanguages] =
    useState<Array<LanguageItemProps>>([] as any);

  // this will only once when the array is empty (by-default)
  useEffect(() => {
    if (addedLanguages.length < 10) {
      for (let count = 0; count < 10; count++) {
        setAddedLanguages([
          ...addedLanguages,
          { state: "No-language" },
        ])
      }
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Drag-and-dropping list re-order
      const sortableList: any = document.querySelector(".Language-itemsContainer") as any;
      const items: Array<any> = sortableList.querySelectorAll(".Language-item") as any;

      items.forEach(item => {
        item.addEventListener("dragstart", () => {
          // Adding dragging class to item after a delay
          setTimeout(() => item.classList.add("dragging"), 0);
        });
        // Removing dragging class from item on dragend event
        item.addEventListener("dragend", () => item.classList.remove("dragging"));
      });

      const initSortableList = (e: any) => {
        e.preventDefault();
        const draggingItem = document.querySelector(".dragging");
        // Getting all items except currently dragging and making array of them
        let otherLanguages = [...sortableList.querySelectorAll(".Language-item:not(.dragging)")];

        // Finding the language after which the dragging item should be placed
        let nextLanguage = otherLanguages.find(otherLanguage => {
          return e.clientY <= otherLanguage.offsetTop + otherLanguage.offsetHeight / 2;
        });

        // Inserting the dragging item before the found language
        console.log("draggingItem", draggingItem, "nextLanguage", nextLanguage);
        sortableList.insertBefore(draggingItem, nextLanguage);
      }

      sortableList.addEventListener("dragover", initSortableList);
      // @ts-ignore
      sortableList.addEventListener("dragenter", e => e.preventDefault());
    }
  }, [window, document]);

  return (
    <div className="w-[840px] h-auto rounded-lg border border-neutral-200 p-4">
      <p className="leading-snug font-normal text-sm text-neutral-500 tracking-tight">
        {"The skills you mention here will help hackathon organizers in assessing you as a potential participant."}
      </p>
      <div className="Language-itemsContainer w-full h-fit p-4 border border-neutral-100 bg-neutral-100 rounded-md mt-4 columns-2 gap-4 overflow-y-scroll">
        {addedLanguages.map((language: LanguageItemProps, index: number) => {
          return (
            <LanguageItem
              className={"Language-item mb-4"}
              state={language.state}
              languageData={language.languageData}
              key={index}
            />
          )
        })}
      </div>
    </div>
  )
};

const LanguageItem: React.FunctionComponent<LanguageItemProps> = ({ className, state, languageData, ...props }) => {
  const [languageInput, setLanguageInput] = useState<string>("");
  const [languageEditingMode, setLanguageEditingMode]
    = useState<"No-language" | "Add-language" | "Language">(state);

  const [currentDefaultEditingMode, setCurrentDefaultEditingMode]
    = useState<"No-language" | "Add-language" | "Language">(state);

  const [languageRecommendation, setLanguageRecommendation]
    = useState<Array<string>>([] as string[]);

  switch (languageEditingMode) {
    case "No-language":
      return (
        <div
          className={cn("w-full h-auto p-4 font-medium text-lg tracking-tight bg-neutral-100 hover:brightness-95 text-neutral-500  border border-neutral-200 rounded-md select-none cursor-pointer",
            className
          )}
          onClick={() => setLanguageEditingMode("Add-language")}
          {...props}
        >
          {"Add Language"}
        </div>
      )
    case "Add-language":
      return (
        <div
          className={cn("w-full h-auto p-4 font-medium text-lg tracking-tight bg-white rounded-md border border-transparent shadow",
            className
          )}
          {...props}
        >
          <input
            className="focus:outline-none w-full"
            type={"text"}
            placeholder="Search for languages"
            defaultValue={languageInput}
            onChange={(e) => setLanguageInput(e.target.value as string)}
          />
          <div className="flex flex-row items-center justify-end gap-2 mt-2">
            <Button
              variant="Outline"
              className="text-sm rounded-lg px-4 py-1.5"
              onClick={() => {
                !languageInput ? setLanguageEditingMode("No-language") : setLanguageEditingMode(currentDefaultEditingMode)
              }}
            >
              {"Cancel"}
            </Button>
            <Button className="text-sm rounded-lg px-4 py-1.5"
              onClick={() => {
                if (languageInput) {
                  setLanguageEditingMode("Language");
                  setCurrentDefaultEditingMode("Language");
                } else {
                  setLanguageEditingMode("No-language");
                  setCurrentDefaultEditingMode("No-language");
                }
              }}
            >
              {"Save"}
            </Button>
          </div>
        </div>
      )
    case "Language":
      return (
        <div
          className={cn("flex flex-row items-center justify-between w-full h-auto p-4 text-neutral-100 font-medium text-lg tracking-tight bg-gradient-to-t from-neutral-900 to-neutral-700 rounded-md border border-transparent cursor-grab shadow-xl",
            className
          )}
          onClick={() => setLanguageEditingMode("Add-language")}
          draggable={true}
          {...props}
        >
          {languageInput}
          <span className="grip-dndIconWrapper">
            <Grip color="#ffffff60" width={18} />
          </span>
        </div>
      )
    default: return <></>;
  }
}

export default LanguageDropdown;