import { Theme, createMuiTheme } from "@material-ui/core/styles";
export const themes: Theme[] = [
    createMuiTheme({
        palette: {
            type: "light",
            background: { default: "#fdfdfd" }
        },
    }),
    createMuiTheme({
        palette: {
            type: "dark",
            primary: { main: "#30e1f5" },
            secondary: { main: "#ffa500" },
            background: {
                default: "rgb(29, 29, 29)",
                paper: "rgba(45, 45, 45, 0.9)"
            },
            action: {
                hover: "#1cabbb",
                hoverOpacity: 0.25,
            }
        },
    })
];