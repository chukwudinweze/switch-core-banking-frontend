interface ContentWrapperProp {
  children: React.ReactNode;
}

const PopoverContentWrapper = ({ children }: ContentWrapperProp) => {
  return <div className="mx-10">{children}</div>;
};

export default PopoverContentWrapper;
