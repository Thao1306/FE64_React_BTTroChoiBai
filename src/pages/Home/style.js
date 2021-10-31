import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles((theme) => {
  return {
    title: {
      backgroundColor: "pink",
      fontSize: 40,
      fontWeight: theme.typography.fontWeightBold
    },
    notification: {
      height: "100%",
      display: "flex",
      alignContent: "space - around",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }
  };
});

export default useStyle;
