function Square(props) {
  return (
    <button className="square" onClick={(e) => props.updateBoard()} id={props.id}>
      {props.value}
    </button>
  );
}

export default Square;
