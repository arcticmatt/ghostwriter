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
      className="w-40 h-8"
      placeholder=""
      value={
        personality == null ? null : { value: personality, label: personality }
      }
    />
  );
}
