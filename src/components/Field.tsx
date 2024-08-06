type Props = {
  children: React.ReactNode;
};

export default function Field({ children }: Props) {
  return <td className="py-1 px-4">{children}</td>;
}
