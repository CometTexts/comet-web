import { ChangeEventHandler, RefObject, useContext } from "react";
import { stateContext } from ".";
import { Avatar, Button, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import getInitials from "@/tools/getInitials";
import { Replay } from "@mui/icons-material";

type HandleFieldChange = (
  setState: React.Dispatch<React.SetStateAction<string>>
) => ChangeEventHandler<HTMLInputElement>;

const GroupInfo: React.FC = () => {
  const state = useContext(stateContext);

  const handleFieldChange: HandleFieldChange = (setState) => {
    return (evt: any) => {
      setState(evt.target.value);
    };
  };

  const regenerateJoinCode = () => {
    state.joinCode.setState([...Array(8)].map(() => Math.floor(Math.random() * 16).toString(16)).join(""));
  };

  const handleOpenFileUpload = () => {
    if (state.iconInputRef.current) {
      state.iconInputRef.current.click();
    }
  };

  const handleIconChange = () => {
    if (state.iconInputRef.current && state.iconInputRef.current.files) {
      const url = URL.createObjectURL(state.iconInputRef.current.files[0]);
      state.iconUrl.setState(url);
    }
  };

  const handleIconReset = () => {
    state.iconUrl.setState(undefined);
    if (state.iconInputRef.current) {
      state.iconInputRef.current.value = "";
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <div style={{ display: "flex", gap: "1rem" }}>
        <Avatar src={state.iconUrl.state} alt={state.groupName.state} sx={{ width: 96, height: 96, fontSize: "48px" }}>
          {getInitials(state.groupName.state, 2)}
        </Avatar>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: ".25rem" }}>
          <Button variant="contained" onClick={handleOpenFileUpload}>
            Change Icon
          </Button>
          <input onChange={handleIconChange} type="file" style={{ display: "none" }} ref={state.iconInputRef} />
          <Button onClick={handleIconReset}>Reset Icon</Button>
        </div>
      </div>
      <div style={{ display: "flex", gap: "1rem" }}>
        <TextField
          variant="filled"
          label="Group Name"
          value={state.groupName.state}
          onChange={handleFieldChange(state.groupName.setState)}
          sx={{ flex: 1 }}
        />
        <TextField
          variant="filled"
          label="Join Code"
          value={state.joinCode.state}
          sx={{ flex: 1 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Regenerate Join Code">
                  <IconButton onClick={regenerateJoinCode}>
                    <Replay />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default GroupInfo;
