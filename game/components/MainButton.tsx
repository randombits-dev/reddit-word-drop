export const MainButton = (props: { onClick: () => void, children }) => {
  return (
    <button
      className="relative z-20 text-black border-2 font-bold border-neutral-900 font-['Comic_Helvetic'] px-3 py-2"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
