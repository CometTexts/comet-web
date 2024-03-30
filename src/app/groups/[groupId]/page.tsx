"use client";

import useAuthStore from "@/hooks/useAuthStore";
import pb from "@/pb";
import { Collections, Group, Message } from "@/types";
import { Send } from "@mui/icons-material";
import { IconButton, InputAdornment, Skeleton, TextField, Typography } from "@mui/material";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import MessageItem from "./messageItem";

interface IParams {
  [key: string]: string;
  groupId: string;
}

const Group: NextPage = () => {
  const { groupId } = useParams<IParams>();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageToSend, setMessageToSend] = useState("");
  const [group, setGroup] = useState<Group>();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [authStore] = useAuthStore();
  const scrollDivRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    const newMessages = await pb
      .collection(Collections.Messages)
      .getFullList<Message>({ filter: `group="${groupId}"`, sort: "+created", expand: "from" });
    setMessages(newMessages);
    setLoading(false);
  };

  const fetchGroup = async () => {
    try {
      const newGroup = await pb.collection(Collections.Groups).getOne<Group>(groupId);
      setGroup(newGroup);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (messages.length > 0 && !hasScrolled) {
      scrollDivRef.current?.scroll?.({ top: scrollDivRef.current?.scrollHeight });
      setHasScrolled(true);
    }
  }, [messages]);

  useEffect(() => {
    fetchMessages();
    // fetchGroup();
  }, []);

  const handleMessageChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setMessageToSend(evt.target.value);
  };

  const handleMessageSubmit = async () => {
    try {
      const message = await pb
        .collection(Collections.Messages)
        .create<Message>({ from: authStore.model?.id, group: groupId, text: messageToSend.trim() } as Message);
      setMessageToSend("");
      handleAddMessage({ ...message, expand: { from: authStore.model } });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMessage = (message: Message) => {
    const newMessages = [...messages, message];

    newMessages.sort((a, b) => {
      if (a.created > b.created) {
        return 0;
      } else if (a.created < b.created) {
        return 1;
      } else {
        return 0;
      }
    });

    setMessages(newMessages);
  };

  return (
    <>
      <TextField
        label={group ? `Send a message to ${group.name}` : `Send a message`}
        variant="filled"
        value={messageToSend}
        onChange={handleMessageChange}
        multiline
        InputProps={{
          style: { borderRadius: 0 },
          endAdornment: (
            // styles fix bug where the adornment is too low on a multiline textfield
            <InputAdornment position="end" style={{ position: "relative", bottom: ".5rem" }}>
              <IconButton onClick={handleMessageSubmit} disabled={messageToSend.trim().length === 0}>
                <Send />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <div
        ref={scrollDivRef}
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "1rem 2rem",
          overflowY: "scroll",
        }}
      >
        {!loading && (
          <Typography variant="h5" component="p" style={{ textAlign: "center", fontWeight: "bold" }}>
            {messages.length === 0 ? "No messages have been sent yet!" : "You've reached the beginning of this group."}
          </Typography>
        )}
        {loading
          ? new Array(4).fill("").map((_, i) => {
              return <Skeleton variant="rounded" style={{ height: 64, margin: ".5rem 0" }} key={i} />;
            })
          : messages.map((message) => {
              return <MessageItem message={message} group={group} />;
            })}
        <div style={{ overflowAnchor: "auto", height: "1px" }} />
      </div>
    </>
  );
};

export default Group;
