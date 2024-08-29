type Props = {
  children: React.ReactNode;
};

export default function InfiniteContainer({ children }: Props) {
  return <div className="my-infinite-container">{children}</div>;
}
