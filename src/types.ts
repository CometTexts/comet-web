import { MouseEventHandler, ReactNode } from "react";
import { RecordModel } from "pocketbase";

export type ILayout = React.FC<{ children: ReactNode }>;

export enum Collections {
  Users = "users",
  Groups = "groups",
  Messages = "messages",
}

export interface User extends RecordModel {
  username: string;
  email: string;
  emailVisibility: boolean;
  verified: boolean;
  name: string;
  avatar?: string;
  joinedGroups: string[];
  subscriber: boolean;
}

export interface Group extends RecordModel {
  name: string;
  joinCode: string;
  owner: string;
  allowedPosters: string[];
  icon?: string;
}

export type AttachmentType = "image" | "video" | "audio" | "file";

export interface Message extends RecordModel {
  group: string;
  from: string;
  text: string;
  attachmentType?: AttachmentType;
  attachment?: string;
}

export type Handler<T extends Array<any>> = (...arg0: T) => MouseEventHandler<HTMLAnchorElement>;

export type WithExpand<T = any, E = any> = T & { expand: E };
