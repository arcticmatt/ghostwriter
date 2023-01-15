import type { Maybe } from "~/types/UtilityTypes";
import CreatableSelect from "react-select/creatable";
import Personality from "~/types/enums/Personality";

const OPTIONS = Object.values(Personality).map((personality) => ({
  label: personality,
  value: personality,
}));

type Props = {
  personality: Maybe<string>;
  setPersonality: (val: string) => void;
};

export default function PersonalitySelect({
  personality,
  setPersonality,
}: Props) {
  return (
    <CreatableSelect
      onChange={(val) => setPersonality((val as any).value)}
      options={OPTIONS}
      className="h-8 w-40"
      placeholder=""
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          borderColor: "#139576",
          boxShadow: "none",
          "&:hover": {
            borderColor: "#139576",
          },
        }),
        option: (baseStyles, state) => ({
          ...baseStyles,
          backgroundColor: state.isSelected ? "#139576" : "#F5F5F5",
          "&:hover": !state.isSelected
            ? {
                backgroundColor: "#139576",
                color: "white",
              }
            : {},
        }),
      }}
      value={
        personality == null ? null : { value: personality, label: personality }
      }
    />
  );
}
