type Props = {
  children: React.ReactNode;
};

export default function Bold({ children }: Props) {
  return <span className="font-bold">{children}</span>;
}
