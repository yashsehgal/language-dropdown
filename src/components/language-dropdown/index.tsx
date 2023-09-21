import { useEffect, useState } from "react";
import { LanguageItemProps } from "./types";
import {
  cn
} from "../../utils/cn";

import { MotionProps, motion } from "framer-motion";

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
import { recommendLanguages } from "../../utils/recommendLanguages";

const LanguageDropdown: React.FunctionComponent = () => {
  const [addedLanguages, setAddedLanguages] =
    useState<Array<LanguageItemProps>>([] as any);

  // this will only once when the array is empty (by-default)
  useEffect(() => {
    if (addedLanguages.length < 10) {
      for (let count = 0; count < 10; count++) {
        setAddedLanguages([
          ...addedLanguages,
          {
            state: "No-language", languageData: {
              title: "",
              rank: count
            }
          },
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
      sortableList.addEventListener("dragenter",
        (e: React.ChangeEvent<any>) => e.preventDefault());
    }
  }, []);

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
              setAddedLanguages={setAddedLanguages}
              key={index}
            />
          )
        })}
      </div>
    </div>
  )
};

const LanguageItem: React.FunctionComponent<LanguageItemProps> = ({
  className,
  state,
  languageData,
  setAddedLanguages,
  ...props }) => {
  const [languageInput, setLanguageInput] = useState<string>(languageData?.title || "");
  const [languageEditingMode, setLanguageEditingMode]
    = useState<"No-language" | "Add-language" | "Language">(state);

  const [currentDefaultEditingMode, setCurrentDefaultEditingMode]
    = useState<"No-language" | "Add-language" | "Language">(state);

  const [languageRecommendation, setLanguageRecommendation]
    = useState<any[]>([]);

  // fetching language recommendations
  useEffect(() => {
    if (languageInput.length === 1) {
      (async () => {
        setLanguageRecommendation(
          await recommendLanguages()
        )
      })();
    }

    // filtering the list of recommended languages
    function filterRecommendations(allRecommendations: string[], inputString: string) {
      return allRecommendations.filter((_language) => {
        if (_language.startsWith(inputString) || _language.includes(inputString)) {
          return _language;
        }
      })
    }
    setLanguageRecommendation(
      filterRecommendations(languageRecommendation, languageInput.toLowerCase())
    )
  }, [languageInput]);

  // method to update language in input via recommendations
  const changeLanguageViaRecommendation = (language: string) => {
    setLanguageInput(language);
  };

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
            onChange={(e) => setLanguageInput(e.target.value as string)}
            value={languageInput}
          />
          {languageRecommendation && <div className="Language-recommendationsWrapper my-2 grid grid-cols-1 gap-2 max-h-[240px] overflow-y-scroll">
            {languageRecommendation?.map((recommendation: any, recommendationIndex: number) => {
              return (
                <Button
                  variant="Outline"
                  className="px-2 py-1 rounded-sm text-sm font-normal truncate"
                  onClick={() => {
                    // changing the languageInput with the selected language recommendation
                    changeLanguageViaRecommendation(recommendation);
                    // reseting the states
                    setLanguageRecommendation([]);
                  }}
                  key={recommendationIndex}
                >
                  {recommendation}
                </Button>
              )
            })}
          </div>}
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
                  for (let count = 0; count)
                } else {
                  setLanguageEditingMode("No-language");
                  setCurrentDefaultEditingMode("No-language");
                }
                // reseting the states
                setLanguageRecommendation([]);
              }}
            >
              {"Save"}
            </Button>
          </div>
        </div >
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