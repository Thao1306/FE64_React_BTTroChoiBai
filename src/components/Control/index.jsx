import React, { useCallback, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector, useStore } from "react-redux";

const Control = () => {
  const deckCard = useSelector((state) => {
    return state.card.deckCard;
  });
  const playList = useSelector((state) => {
    return state.player.playerList;
  });

  const dispatch = useDispatch();

  const drawCards = useCallback(() => {
    axios({
      method: "GET",
      url: `http://deckofcardsapi.com/api/deck/${deckCard.deck_id}/draw/?count=12`,
    })
      .then((res) => {
        const players = [...playList];
        console.log(players);
        //chia bài
        for (const i in res.data.cards) {
          const playerIndex = i % 4;
          players[playerIndex].cards.push(res.data.cards[i]);

          //i = 0, playerIndex = 0 => card[0] => player[0]
          //i = 1, playerIndex = 1 => card[1] => player[1]
          //i = 2, playerIndex = 2 => card[2] => player[2]
          //i = 3, playerIndex = 3 => card[3] => player[3]
          //i = 4, playerIndex = 0 => card[4] => player[0]
          //i = 5, playerIndex = 1 => card[5] => player[1]
          //i = 6, playerIndex = 2 => card[6] => player[2]
        }
        dispatch({ type: "SET_PLAYERS", payload: players });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [deckCard, playList]);

  //Hàm useStore dùng để lấy dữ liệu về dùng mà ko thay đổi như useSelector
  // const store = useStore();
  // store.getState()

  const revealCards = useCallback(() => {
    //1. Lật bài
    dispatch({type: "REVEAL_CARDS"})
    //2. tính kết quả
      //check playerList
        //TH đặc biệt : King, Jack, Queen
        //TH còn lại: cộng điểm người chơi, tìm max
        //note: có thể có nhiều hơn 1 người thắng

  }, [dispatch])

  return (
    <div className="d-flex  justify-content-end container">
      <div className="border d-flex justify-content-center align-items-center px-2">
        <button className="btn btn-success mr-2">Shuffle</button>
        <button className="btn btn-info mr-2" onClick={drawCards}>
          Draw
        </button>
        <button className="btn btn-primary mr-2" onClick={revealCards}>Reveal</button>
      </div>
      <div className="d-flex">
        {playList.map((item) => {
          return (
            <div key={item.username} className="border px-3 text-center">
              <p>{item.username}</p>
              <p> {item.totalPoint} </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Control;
