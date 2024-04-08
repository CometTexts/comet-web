"use client";

import pb from "@/pb";
import { Collections, User } from "@/types";
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { ChangeEventHandler, useEffect, useState } from "react";
import axios from "axios";
import endpoints from "@/endpoints.json";
import useAuthStore from "@/hooks/useAuthStore";

const MassNotification: React.FC = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [userIds, setUserIds] = useState<string[]>(["*"]);
  const [message, setMessage] = useState("");
  const [authStore] = useAuthStore();

  useEffect(() => {
    (async () => {
      setAllUsers(await pb.collection(Collections.Users).getFullList());
    })();
  }, []);

  const handleUserIdsChange = (evt: SelectChangeEvent<string[]>) => {
    const value = evt.target.value as string[];
    if (value.length !== 1 && value[0] === "*") {
      value.splice(0, 1);
      setUserIds(value);
    } else if (value.includes("*")) {
      setUserIds(["*"]);
    } else if (value.length === allUsers.length) {
      setUserIds(["*"]);
    } else {
      setUserIds(value);
    }
  };

  const handleMessageChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setMessage(evt.target.value);
  };

  const handleSend = async () => {
    try {
      await axios.post(`${endpoints.notificationServer}/massNotification`, {
        request: {
          userIds,
          message,
        },
        user: {
          token: authStore.token,
          id: authStore.model?.id,
        },
      });

      setUserIds(["*"]);
      setMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <FormControl variant="filled" sx={{ width: "100%" }}>
        <InputLabel>Users</InputLabel>
        <Select multiple value={userIds} onChange={handleUserIdsChange} label="Users">
          <MenuItem value="*">*</MenuItem>
          {allUsers.map((user) => {
            return (
              <MenuItem value={user.id} key={user.id}>
                {user.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <TextField
        variant="filled"
        label="Title"
        value="System Message"
        disabled
        InputProps={{ sx: { borderRadius: 0 } }}
      />
      <TextField
        multiline
        variant="filled"
        label="Message"
        value={message}
        onChange={handleMessageChange}
        sx={{ width: "100%", minWidth: "500px" }}
        InputProps={{ sx: { borderTopLeftRadius: 0, borderTopRightRadius: 0 } }}
      />
      <Button variant="contained" onClick={handleSend} sx={{ alignSelf: "flex-end", marginTop: ".5rem" }}>
        Send
      </Button>
    </div>
  );
};

export default MassNotification;
