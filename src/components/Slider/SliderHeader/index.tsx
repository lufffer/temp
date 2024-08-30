import { ReactNode } from "react";

type Props = {
  className?: string;
  children: ReactNode;
};

function SliderHeader({ className, children }: Props) {
  return <header className={className}>{children}</header>;
}

export { SliderHeader };
