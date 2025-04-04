

const Tag = ( { text, otherStyle } ) => {
  return (
    <div className={`w-auto items-center gap-1 rounded-full p-1 px-5 bg-primary-200 inline-flex  text-primary-700 text-[10px] ${otherStyle}`}>
      {/* Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-3 h-3"
      >
        <path
          fillRule="evenodd"
          d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.74a.75.75 0 011.04-.207z"
          clipRule="evenodd"
        />
      </svg>
      {/* Text */}
      <span>{text}</span>
    </div>
  );
};

export default Tag;