type Props = {
  className: string;
  children: React.ReactNode;
};

export default function BorderedContainer({ className, children }: Props) {
  return <div className={`my-bordered-container ${className}`}>{children}</div>;
}
