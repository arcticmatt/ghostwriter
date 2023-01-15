import ContentType from "~/types/enums/ContentType";
import type { Maybe } from "~/types/UtilityTypes";
import CreatableSelect from "react-select/creatable";

const OPTIONS = Object.values(ContentType).map((contentType) => ({
  label: contentType,
  value: contentType,
}));

type Props = {
  contentType: Maybe<string>;
  setContentType: (val: string) => void;
};

export default function ContentTypeSelect({
  contentType,
  setContentType,
}: Props) {
  return (
    <CreatableSelect
      onChange={(val) => setContentType((val as any).value)}
      options={OPTIONS}
      placeholder=""
      className="h-8 w-40"
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
        contentType == null ? null : { value: contentType, label: contentType }
      }
    />
  );
}
