import type { Maybe } from "~/types/UtilityTypes";
import Select from "react-select";
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
    <Select
      onChange={(val) => setPersonality((val as any).value)}
      options={OPTIONS}
      placeholder="Select a person"
      value={
        personality == null ? null : { value: personality, label: personality }
      }
    />
  );
}
