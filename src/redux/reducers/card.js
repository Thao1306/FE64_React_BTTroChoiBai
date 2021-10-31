import { typeOfCard } from "../actions/types";

let initialState = {
  deckCard: {},
  isReveal: false,
  reveal: false,
  draw: true,
  game: 1
};

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case typeOfCard.SET_DECK_CARD:
      state.deckCard = payload;
      return { ...state };
    case typeOfCard.REVEAL_CARDS:
      state.isReveal = true;

      state.game += 1;
      return { ...state };
    case typeOfCard.DRAW_CARDS:
      state.isReveal = false;

      return { ...state };
    case typeOfCard.SHUFFLE_CARDS:
      state.deckCard = payload;

      return { ...state };
    case typeOfCard.RESET_GAME:
      state = payload;
      return { ...state };
    default:
      return state;
  }
};

export default reducer;
