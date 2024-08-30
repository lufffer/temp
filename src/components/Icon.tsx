type Props = {
  src: string;
  title: string;
};

const size = 28;

function Icon({ src, title }: Props) {
  return (
    <img
      src={src}
      alt="icon"
      title={title}
      width={size}
      height={size}
      className="cursor-pointer"
    />
  );
}

export default Icon;
