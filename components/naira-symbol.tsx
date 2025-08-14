interface NairaSymbolProps {
  className?: string;
}

const NairaSymbol = ({ className }: NairaSymbolProps) => {
  return <span className={className}>&#8358;</span>;
};

export default NairaSymbol;
