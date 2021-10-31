import axios from "axios";
import { typeOfCard, typeOfPlayer } from "../../redux/actions/types";

export const drawCardsAction = (deckCard, playList, dispatch) => {
  return axios({
    method: "GET",
    url: `http://deckofcardsapi.com/api/deck/${deckCard.deck_id}/draw/?count=12`
  })
    .then((res) => {
      const players = [...playList];
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
      dispatch({ type: typeOfPlayer.SET_PLAYERS, payload: players });
      dispatch({ type: typeOfCard.DRAW_CARDS });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const shuffleCardsAction = (dispatch) => {
  axios({
    method: "GET",
    url: "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
  })
    .then((res) => {
      dispatch({ type: typeOfCard.SHUFFLE_CARDS, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};

export const getDeckCard = (dispatch) => {
  axios({
    method: "GET",
    url: "http://deckofcardsapi.com/api/deck/new/"
  })
    .then((res) => {
      dispatch({ type: typeOfCard.SET_DECK_CARD, payload: res.data });
    })
    .catch((err) => {
      console.log(err);
    });
};
