type Props = {
  className: string;
  bgImg: string;
  borderWidth: string;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  children: React.ReactNode;
};

function Thumb({ className, bgImg, borderWidth, onClick, children }: Props) {
  return (
    <div
      className={className}
      style={{
        backgroundImage: bgImg,
        borderWidth: borderWidth,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export default Thumb;
