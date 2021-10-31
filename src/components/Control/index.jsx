import React, { useCallback, useState } from "react";
import { useDispatch, useSelector, useStore } from "react-redux"; //dùng useStore khi cần lấy dữ liệu trên store xuống dùng mà component ko cần phải render lại, còn nếu component phải render lại thì dùng useSelector (do useSeclector đổi thì state của component cũng đổi nên phải render lại)
import { typeOfCard, typeOfPlayer } from "../../redux/actions/types";
import { drawCardsAction, shuffleCardsAction } from "../../redux/actions/cards";

const Control = () => {
  //Hàm useStore dùng để lấy dữ liệu về dùng mà ko thay đổi state của component như useSelector
  // const store = useStore();
  // store.getState()

  const playList = useSelector((state) => {
    return state.player.playerList;
  });
  const { deckCard } = useSelector((state) => state.card);
  const dispatch = useDispatch();
  let [reveal, setReveal] = useState(false);
  let [shuffle, setShuffle] = useState(false);
  let [draw, setDraw] = useState(true);

  //Draw cards:
  const drawCards = useCallback(() => {
    setReveal((reveal = true));
    setShuffle((draw = false));
    setDraw((shuffle = false));
    drawCardsAction(deckCard, playList, dispatch);
  }, [deckCard, playList, dispatch]);

  //Reveal cards:
  const setPoint = (players, winnerList, gain, lose) => {
    return players.map((player) => {
      let newItem = { ...player };

      let winner = winnerList.find((item) => player.username === item.username);

      if (winner) {
        newItem.totalPoint = player.totalPoint + gain;
      } else {
        newItem.totalPoint = player.totalPoint - lose;
      }
      return newItem;
    });
  };

  const revealCards = useCallback(() => {
    setReveal((reveal = false));
    setShuffle((draw = true));
    setDraw((shuffle = false));
    //1. Lật bài
    dispatch({ type: typeOfCard.REVEAL_CARDS });
    //2. tính kết quả
    //check playerList

    //TH còn lại: cộng điểm người chơi, tìm max
    //note: có thể có nhiều hơn 1 người thắng, danh sách người thắng phải là 1 cái mảng
    let players = [...playList];
    let winnerList = [{ username: "", result: 0, totalPoint: 25000 }];

    const resultList = players.map((item) => {
      let resPlayerList = {};
      //TH đặc biệt : King, Jack, Queen
      let arrKJQCase = item.cards.filter(
        (card) =>
          card.value === "QUEEN" ||
          card.value === "KING" ||
          card.value === "JACK"
      );
      //TH đặc biệt : 3 cào
      let sameThreeCardCase = 0;
      item.cards.reduce((preValue, currVal) => {
        if (currVal.value === preValue.value) {
          sameThreeCardCase += 1;
        }
        return currVal;
      });
      if (sameThreeCardCase === 2) {
        resPlayerList = {
          username: item.username,
          result: 11,
          totalPoint: item.totalPoint
        };
        return resPlayerList;
      }
      if (arrKJQCase.length === 3) {
        resPlayerList = {
          username: item.username,
          result: 10,
          totalPoint: item.totalPoint
        };
        return resPlayerList;
      } else {
        const point = item.cards.reduce((pointCard, card) => {
          if (card.value === "ACE") {
            card.value = 1;
          }
          if (
            card.value === "QUEEN" ||
            card.value === "KING" ||
            card.value === "JACK"
          ) {
            card.value = 10;
          }

          pointCard += +card.value;
          return pointCard;
        }, 0);

        resPlayerList = {
          username: item.username,
          result: point % 10,
          totalPoint: item.totalPoint
        };
        return resPlayerList;
      }
    });

    for (let player of resultList) {
      if (player.result > winnerList[0].result) {
        winnerList = [{ ...player }];
      }
      if (player.result === winnerList[0].result) {
        if (!winnerList.find((item) => item.username === player.username)) {
          winnerList.push(player);
        }
      }
    }
    switch (winnerList.length) {
      case 1:
        players = setPoint(players, winnerList, 15000, 5000);
        break;
      case 2:
        players = setPoint(players, winnerList, 5000, 5000);
        break;
      case 3:
        players = setPoint(players, winnerList, Math.round(5000 / 3), 5000);
        break;
      default:
        players = setPoint(players, winnerList, 0, 0);
        break;
    }
    //3.Dispatch new playerList với new totalPoint
    dispatch({ type: typeOfPlayer.SET_PLAYERS, payload: players });
  }, [dispatch, setPoint, playList]);

  //Shuffle cards:

  const shuffleCards = useCallback(() => {
    setReveal((reveal = false));
    setShuffle((draw = false));
    setDraw((shuffle = true));

    shuffleCardsAction(dispatch);

    const players = playList.map((player) => ({ ...player, cards: [] }));

    dispatch({ type: typeOfPlayer.SET_PLAYERS, payload: players });
  }, [playList, dispatch]);

  return (
    <div className="d-flex  justify-content-end container">
      <div className="border d-flex justify-content-center align-items-center px-2">
        <button
          className="btn btn-success mr-2"
          disabled={!shuffle}
          onClick={shuffleCards}
        >
          Shuffle
        </button>
        <button
          className="btn btn-info mr-2"
          onClick={drawCards}
          disabled={!draw}
        >
          Draw
        </button>
        <button
          className="btn btn-primary mr-2"
          onClick={revealCards}
          disabled={!reveal}
        >
          Reveal
        </button>
      </div>
      <div className="d-flex">
        {playList.map((item) => {
          return (
            <div key={item.username} className="border px-3 text-center">
              <p>{item.username}</p>
              <p> {item.totalPoint.toLocaleString()} </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Control;
