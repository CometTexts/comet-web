"use client";

import useAuthStore from "@/hooks/useAuthStore";
import pb from "@/pb";
import { Collections, WithExpand } from "@/types";
import type { Group, Message, User } from "@/types";
import { Send } from "@mui/icons-material";
import { IconButton, InputAdornment, Skeleton, TextField, Typography } from "@mui/material";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import { ChangeEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import MessageItem from "./messageItem";
import { PBEventHandler, pocketBaseHandler } from "@/messageEventHandler";

interface IParams {
  [key: string]: string;
  groupId: string;
}

const Group: NextPage = () => {
  const { groupId } = useParams<IParams>();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<WithExpand<Message, { from: User }>[]>([]);
  const [messageToSend, setMessageToSend] = useState("");
  const [group, setGroup] = useState<Group>();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [authStore] = useAuthStore();
  const scrollDivRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    if (loading === true) {
      const newMessages = await pb.collection(Collections.Messages).getFullList<WithExpand<Message, { from: User }>>({
        filter: `group="${groupId}"`,
        sort: "+created",
        expand: "from",
      });
      setMessages(newMessages);
      setLoading(false);
    }
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
    fetchGroup();
  }, []);

  useEffect(() => {
    const handleMessageEvent: PBEventHandler<Message> = async ({ action, record }) => {
      if (record.group === groupId) {
        switch (action) {
          case "create": {
            const messageUser = await pb.collection<User>(Collections.Users).getOne(record.from);
            handleAddMessage({ ...record, expand: { from: messageUser } });
            break;
          }
          case "update": {
            const newMessages = [...messages];
            setMessages(
              newMessages.map((message) => {
                if (message.id === record.id) {
                  return {
                    ...record,
                    expand: {
                      from: message.expand.from,
                    },
                  };
                }
                return message;
              })
            );
            break;
          }
          case "delete": {
            const index = messages.findIndex((message) => message.id === record.id);
            console.log(index);
            if (index !== undefined) {
              const newMessages = [...messages];
              console.log("removed message:", newMessages.splice(index, 1));
              console.log(newMessages);
              setMessages(newMessages);
            } else {
              console.error("Received a message delete event for a message that does not exist!");
            }
            break;
          }
        }
      }
    };

    pocketBaseHandler.on("messageEvent", handleMessageEvent);

    return () => {
      pocketBaseHandler.removeListener("messageEvent", handleMessageEvent);
    };
  }, [messages, groupId]);

  const handleMessageChange: ChangeEventHandler<HTMLInputElement> = (evt) => {
    setMessageToSend(evt.target.value);
  };

  const handleMessageSubmit = async () => {
    try {
      const message = pb
        .collection(Collections.Messages)
        .create<Message>({ from: authStore.model?.id, group: groupId, text: messageToSend.trim() } as Message);
      setMessageToSend("");
      await message;
      //PB subscription will add the message
    } catch (err) {
      console.error(err);
    }
  };

  useMemo(() => {
    console.log("Messages have been updated:", messages);
  }, [messages]);

  const handleAddMessage = useCallback(
    (message: WithExpand<Message, { from: User }>) => {
      if (messages.length > 0) {
        const existsArr: number[] = messages.map((item) => (item.id === message.id ? 1 : 0));
        const exists = existsArr.reduce((previous, current) => previous + current);
        if (exists !== 0) {
          //message already exists; ignore
          return;
        }
      }

      const newMessages = [...messages, message];

      setMessages(newMessages);
    },
    [messages]
  );

  return (
    <>
      {(group?.allowedPosters.includes(authStore.model?.id) || group?.owner === authStore.model?.id) && (
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
      )}
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
          <Typography
            variant="h5"
            component="p"
            style={{ textAlign: "center", fontWeight: "bold", overflowAnchor: "none" }}
          >
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
        <div style={{ overflowAnchor: "auto", height: "1px", minHeight: "1px" }} />
      </div>
    </>
  );
};

export default Group;
