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
  hasError: boolean;
};

export default function PersonalitySelect({
  personality,
  setPersonality,
  hasError,
}: Props) {
  return (
    <CreatableSelect
      onChange={(val) => setPersonality((val as any).value)}
      options={OPTIONS}
      className="w-full h-8 md:w-40"
      placeholder=""
      styles={{
        control: (baseStyles) => ({
          ...baseStyles,
          borderColor: hasError ? "red" : "#139576",
          boxShadow: "none",
          minWidth: "80px",
          height: "38px",
          borderRadius: "0.5rem",
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
