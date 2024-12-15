export const MainButton = (props: { onClick: () => void, children }) => {
  return (
    <button
      className="relative z-20 text-black font-bold text-white bg-neutral-900 font-['Comic_Helvetic'] px-5 pt-3 pb-2"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
