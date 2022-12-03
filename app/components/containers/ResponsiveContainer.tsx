import type { CSSProperties } from "react";
import joinClasses from "~/utils/joinClasses";

type Props = {
  children: any;
  className?: string;
  height?: string;
  maxWidthDisabled?: boolean;
  style?: CSSProperties;
};

export default function ResponsiveContainer({
  children,
  className,
  height,
  maxWidthDisabled = false,
  style,
}: Props): JSX.Element {
  const styleToUse = {
    ...style,
    height,
    maxWidth: maxWidthDisabled ? "none" : undefined,
  };

  return (
    <div
      className={joinClasses("responsiveContainer-container", className)}
      style={styleToUse}
    >
      {children}
    </div>
  );
}
