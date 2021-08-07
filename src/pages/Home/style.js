import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles((theme) => {
  return {
    title: {
      backgroundColor: "pink",
      fontSize: 40,
      fontWeight: theme.typography.fontWeightBold,
    },
  };
});

export default useStyle;
