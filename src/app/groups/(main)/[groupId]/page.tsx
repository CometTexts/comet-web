"use client";

import useAuthStore from "@/hooks/useAuthStore";
import pb from "@/pb";
import { Collections, WithExpand } from "@/types";
import type { Group, Message, User } from "@/types";
import { AttachFile, Send } from "@mui/icons-material";
import { IconButton, InputAdornment, Paper, Skeleton, TextField, Typography } from "@mui/material";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import { ChangeEventHandler, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import MessageItem from "./messageItem";
import { PBEventHandler, pocketBaseHandler } from "@/messageEventHandler";
import PendingAttachment from "./pendingAttachment";
import { snackbarContext } from "@/components/SnackBar";

interface IParams {
  [key: string]: string;
  groupId: string;
}

const Group: NextPage = () => {
  const { groupId } = useParams<IParams>();
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<WithExpand<Message, { from: User }>[]>([]);
  const [messageToSend, setMessageToSend] = useState("");
  const [group, setGroup] = useState<Group>();
  const [hasScrolled, setHasScrolled] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [authStore] = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollDivRef = useRef<HTMLDivElement>(null);
  const { setSnackbar } = useContext(snackbarContext);

  const fetchMessages = async () => {
    if (loading === true) {
      try {
        const newMessages = await pb.collection(Collections.Messages).getFullList<WithExpand<Message, { from: User }>>({
          filter: `group="${groupId}"`,
          sort: "+created",
          expand: "from",
        });
        setMessages(newMessages);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setSnackbar({
          message: "Failed to fetch messages!",
          isAlert: true,
          severity: "error",
        });
      }
    }
  };

  const fetchGroup = async () => {
    try {
      const newGroup = await pb.collection(Collections.Groups).getOne<Group>(groupId);
      setGroup(newGroup);
    } catch (err) {
      // Group doesn't exist or isn't joined; 404
      setNotFound(true);
    }
  };

  useEffect(() => {
    if (messages.length > 0 && !hasScrolled) {
      scrollDivRef.current?.scroll?.({ top: scrollDivRef.current?.scrollHeight });
      setHasScrolled(true);
    }
  }, [messages]);

  const onFileInputChange = () => {
    if (fileInputRef.current?.files) {
      setFiles((items) => [...items, ...Array.from(fileInputRef.current!.files!)]);
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchGroup();
  }, []);

  useEffect(() => {
    const handleMessageEvent: PBEventHandler<Message> = async ({ action, record }) => {
      console.log(action, record);
      if (record.group === groupId) {
        switch (action) {
          case "create": {
            try {
              const messageUser = await pb.collection<User>(Collections.Users).getOne(record.from);
              handleAddMessage({ ...record, expand: { from: messageUser } });
            } catch (err) {
              setSnackbar({
                message: "Failed to fetch user data for new message!",
              });
            }
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
            console.log("delete event");
            const index = messages.findIndex((message) => message.id === record.id);
            console.log(index);
            if (index !== undefined) {
              setMessages((messages) => {
                const newMessages = [...messages];
                newMessages.splice(index, 1);
                return newMessages;
              });
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
    if (files.length > 0) {
      console.log("files length > 0");
      for (let i = 0; i < files.length; i++) {
        console.log("current file:", i);
        console.log(files[i]);
        const data = new FormData();
        data.append("from", authStore.model?.id);
        data.append("group", groupId);
        if (i === 0 && messageToSend.trim().length > 0) {
          data.append("text", messageToSend.trim());
        } else {
          data.append("text", "$^attachment-only^$");
        }

        data.append("attachment", files[i]);
        const fileType = files[i].type.split("/")[0];
        if (fileType === "image" || fileType === "video" || fileType === "audio") {
          data.append("attachmentType", fileType);
        } else {
          data.append("attachmentType", "file");
        }

        try {
          await pb.collection(Collections.Messages).create<Message>(data);
        } catch {
          setSnackbar({
            message: "Failed to send message!",
            isAlert: true,
            severity: "error",
          });
        }
      }
      setMessageToSend("");
      setFiles([]);
    } else {
      const data = new FormData();
      data.append("from", authStore.model?.id);
      data.append("group", groupId);
      data.append("text", messageToSend.trim());
      try {
        await pb.collection(Collections.Messages).create<Message>(data);
        setMessageToSend("");
      } catch {
        setSnackbar({
          message: "Failed to send message!",
          isAlert: true,
          severity: "error",
        });
      }
    }
  };

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

  const handleUploadFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (notFound) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <Typography variant="h5" fontWeight="bold" sx={{ textAlign: "center" }}>
          Group Not Found
        </Typography>
      </div>
    );
  }

  return (
    <>
      {(group?.allowedPosters.includes(authStore.model?.id) || group?.owner === authStore.model?.id) && (
        <Paper elevation={2} sx={{ borderRadius: 0, width: "100%" }}>
          {files.length > 0 && (
            <div
              style={{
                margin: 0,
                display: "flex",
                width: "100%",
                overflow: "auto",
                whiteSpace: "nowrap",
                gap: "1rem",
                padding: "1rem",
              }}
            >
              {fileInputRef.current?.files &&
                files.map((file, i) => {
                  return <PendingAttachment file={file} index={i} setFileList={setFiles} />;
                })}
            </div>
          )}
          <TextField
            label={group ? `Send a message to ${group.name}` : `Send a message`}
            InputLabelProps={{ sx: { marginLeft: "3rem" } }}
            variant="filled"
            value={messageToSend}
            onChange={handleMessageChange}
            multiline
            fullWidth
            InputProps={{
              style: { borderRadius: 0 },
              startAdornment: (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={onFileInputChange}
                    multiple
                  />
                  <InputAdornment position="start" style={{ position: "relative", bottom: "1rem" }}>
                    <IconButton onClick={handleUploadFile}>
                      <AttachFile />
                    </IconButton>
                  </InputAdornment>
                </>
              ),
              endAdornment: (
                // styles fix bug where the adornment is too low on a multiline textfield
                <InputAdornment position="end" style={{ position: "relative", bottom: ".5rem" }}>
                  <IconButton
                    onClick={handleMessageSubmit}
                    disabled={messageToSend.trim().length === 0 && files.length === 0}
                  >
                    <Send />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Paper>
      )}
      <div
        ref={scrollDivRef}
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "1rem 2rem",
          overflowY: "scroll",
          width: "100%",
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
