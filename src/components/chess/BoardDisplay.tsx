// Styles are from the settings.scss file as that is the only place this component is used

type Props = {
  boardStyle: { light: string; dark: string };
  onClick: () => void;
  selected: boolean;
};

export default function BoardDisplay({ boardStyle, selected, onClick }: Props) {
  const boardDimensions = 5; // I'm not sure if I want to use a full 8x8 board, or a smaller one

  const arr = Array.from(Array(boardDimensions * boardDimensions).keys());
  const isLight = (index: number) => {
    const x = index % boardDimensions;
    const y = Math.floor(index / boardDimensions);

    return (x + y) % 2 === 0;
  };

  const squareElements = arr.map((idx) => {
    const style = { backgroundColor: isLight(idx) ? boardStyle.light : boardStyle.dark };
    return <div key={idx} className="square" style={style} />;
  });

  return (
    <div className="board-display" style={{ gridTemplateColumns: `repeat(${boardDimensions}, 1fr)` }} data-selected={selected} onClick={onClick}>
      {squareElements}
    </div>
  );
}
