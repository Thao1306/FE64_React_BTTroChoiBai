import React, { Fragment, useEffect, memo } from "react";
import "./index.css";
import Controls from "../../components/Control";
import Main from "../../components/Main";
import { useDispatch, useSelector } from "react-redux";
import { getDeckCard } from "../../redux/actions/cards";
import useStyle from "../Home/style";
import { typeOfCard } from "../../redux/actions/types";
import { typeOfPlayer } from "../../redux/actions/types";

const Game = () => {
  // const [a, setA] = useState(0);
  //useEffect đại diện cho cả 3 loại lifecycle như trong class: didMount, didUpdate, willUpdate
  //memo tương tự như pure component trong class (memo sẽ check điều kiện khi nào Game cần render lại thì mới render, tức nêu cha ko có truyền prop cho con/prop ko đổi khi cha render thì memo sẽ xét điều kiện ko ảnh hưởng đến con => con sẽ ko bị render lại)

  //component didMount, unMounted
  // useEffect(() => {
  //   console.log("component didMount");
  //   return () => {
  //     console.log("component unMounted"); //phải set trong useEffect có dependency là mảng [], sẽ chạy khi component bị hủy
  //   };
  // }, []);
  //component didUpdated
  // useEffect(() => {
  //   console.log("component didUpdated");
  // }, [a]);

  //luôn chạy
  // useEffect(() => {
  //   console.log("always run");
  // });
  //--------------

  const dispatch = useDispatch();
  const { player, card } = useSelector((state) => state);
  const classes = useStyle();

  useEffect(() => {
    getDeckCard(dispatch);
  }, []);

  const winner = player.playerList.reduce((maxPoint, currPlayer) => {
    if (maxPoint.totalPoint > currPlayer.totalPoint) {
      return maxPoint;
    } else {
      return currPlayer;
    }
  });
  const rePlay = () => {
    const newPlayerList = player.playerList.map((item) => ({
      ...item,
      totalPoint: 25000,
      cards: []
    }));
    const newCard = { ...card, game: 1, isReveal: false };
    dispatch({ type: typeOfPlayer.SET_PLAYERS, payload: newPlayerList });
    dispatch({ type: typeOfCard.RESET_GAME, payload: newCard });
  };
  return (
    <Fragment>
      {card.game > 5 ? (
        <div className={classes.title} style={{ height: "100vh", textAlign: 'center' }}>
          <div className={classes.notification}>
            <h1 style={{fontWeight: 700}}>Chúc mừng</h1>
            <h3 style={{padding: 30}}>
              người thắng cuộc là {winner.username}
              <br /> với tổng điểm sau 5 lượt chơi là {winner.totalPoint.toLocaleString()}
            </h3>
            <button className='btn btn-warning btn-lg' onClick={rePlay}>Chơi lại</button>
          </div>
        </div>
      ) : (
        <Fragment>
          <Controls />
          <Main />
        </Fragment>
      )}
    </Fragment>
  );
};

export default Game;
// export default memo(Game); //giống pure component trong react class ->bọc các component con ko bị render lại khi component cha render lại trong trường hợp con ko bị ảnh hưởng/hoặc các props cha truyền cho con ko ảnh hưởng
