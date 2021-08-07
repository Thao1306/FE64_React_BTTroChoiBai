import React, { Fragment, useEffect, useState, memo } from "react";
import "./index.css";
import Controls from "../../components/Control";
import Main from "../../components/Main";
import axios from "axios";
import { useDispatch } from "react-redux";

const Game = () => {
  const [a, setA] = useState(0);
  //useEffect đại diện cho cả 3 loại lifecycle như trong class: didMount, didUpdate, willUpdate
  //memo tương tự như pure component trong class (memo sẽ check điều kiện khi nào Game cần render lại thì mới render, tức nêu cha ko có truyền prop cho con/prop ko đổi khi cha render thì memo sẽ xét điều kiện ko ảnh hưởng đến con => con sẽ ko bị render lại)

  //component didMount, unMounted
  useEffect(() => {
    console.log("component didMount");
    return () => {
      console.log("component unMounted"); //phải set trong useEffect có dependency là mảng [], sẽ chạy khi component bị hủy
    };
  }, []);
  //component didUpdated
  useEffect(() => {
    console.log("component didUpdated");
  }, [a]);

  //luôn chạy
  useEffect(() => {
    console.log("always run");
  });
  //--------------
  const dispatch = useDispatch()

  useEffect(() => {
    axios({
      method: "GET",
      url: "http://deckofcardsapi.com/api/deck/new/",
    })
      .then((res) => {
        dispatch({type: "SET_DECK_CARD", payload: res.data})
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Fragment>
      {" "}
      {/* Fragment chức năng giống thẻ <></> là thẻ rỗng, ko render trên giao diện */}
      <Controls />
      <Main />
    </Fragment>
  );
};

export default memo(Game);
