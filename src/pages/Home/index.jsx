import React, { useState, useCallback } from "react";
import Game from "../Game";
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import useStyle from "./style";

// React hook là những function cho ta sử dụng các tính năng của state, lifecycle =>PHẢI ĐƯỢC ĐẶT TRÊN CÙNG VÀ KO LỒNG TRONG BẤT CỨ HÀM NÀO KHÁC
const validationSchema = yup.object().shape({
  username: yup.string().required("This field is requied!"),
  email: yup.string().required("This field is requied").email("Invalid email!"),
  phone: yup
    .string()
    .required("This field is requied")
    .matches(/^[0-9]+$/, "Invalid phone number!"),
});

const Home = () => {
  const [isGameStart, setIsGameStart] = useState(false);
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      phone: "",
    },
    validationSchema: validationSchema, //có thể viết validationSchema không do biến trùng với key
    validateOnMount: true, // cho chạy hàm check validationSchema luôn, nên cho chạy luôn vì nếu ko bật thì mới vào ko 
  });
  const setAllTouched = useCallback(() => {
    Object.keys(formik.values).forEach((key) => {
      const a = formik.setFieldTouched(key);
      console.log(a);
      console.log(formik.touched);
    });
  }, [formik]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    console.log(formik);
    setAllTouched(); //hàm: truyền cho formik.touch username/email/phone để giá trị formik.touch.username turn true-> hiện thẻ <p> báo lỗi (vì lúc này formik.touch đang rỗng nên formik.touch.username sẽ turn false)

    if (!formik.isValid) return; //check nếu form ko có lỗi (ko có false trong bất kỳ trường nào), thì mới cho vào game
    dispatch({
      type: "ADD_PLAYERS",
      payload: { ...formik.values, totalPoint: 25000, cards: [] },
    });

    setIsGameStart(true);
  }, [formik, setAllTouched, dispatch,]);

  const setDefaultPlayer = useCallback(() => {
    const defaultPlayer = {
      username: "Thao.Le",
      email: "Thao@gmail.com",
      phone: "123",
    };
    formik.setValues(defaultPlayer);
  }, [formik]);

  const classes = useStyle();
  return (
    <>
      {isGameStart ? (
        <Game />
      ) : (
        <div
          className="text-center"
          style={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1 className="diplay-4 mb-5"> Welcome to Pocker Center</h1>
          <h3 className={classes.title}>Fill your info and start</h3>
          <form onSubmit={handleSubmit} className="w-25 mx-auto">
            <input
              type="input"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur} //onBlur: khi người dùng vào và ra khỏi form, hàm handleBlur của formik sẽ trả về true cho formik.touched giá trị true khi người dùng blur
              placeholder="username"
              className="w-100 form-control mb-3"
            />
            {formik.touched.username && (
              <p className="text-danger">{formik.errors.username}</p>
            )}
            <input
              type="input"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="email"
              className="w-100 form-control mb-3"
            />
            {formik.touched.email && (
              <p className="text-danger">{formik.errors.email}</p>
            )}

            <input
              type="input"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="phone"
              className="w-100 form-control mb-3"
            />
            {formik.touched.phone && (
              <p className="text-danger">{formik.errors.phone}</p>
            )}

            <button className="btn btn-success">Start new Game</button>
            <button
              type="button"
              onClick={setDefaultPlayer}
              className="btn btn-info"
            >
              Set dafault player
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Home;
