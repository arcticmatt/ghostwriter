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
      placeholder="Select a content type"
      value={
        contentType == null ? null : { value: contentType, label: contentType }
      }
    />
  );
}
