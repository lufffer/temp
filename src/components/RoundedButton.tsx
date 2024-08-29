type Props = {
  className: string;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
};

export default function RoundedButton({ className, onClick, children }: Props) {
  return (
    <button onClick={onClick} className={`my-rounded-button ${className}`}>
      {children}
    </button>
  );
}
