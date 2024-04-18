import EventEmitter from "events";
import pb from "./pb";
import { Collections, Group, Message, User } from "./types";
import { RecordModel, RecordSubscription } from "pocketbase";

export interface PBData<T = RecordModel> {
  action: "update" | "create" | "delete";
  record: T;
}

export type PBEventHandler<T = RecordModel> = (data: PBData<T>) => any;

export const pocketBaseHandler = new EventEmitter<{
  messageEvent: [PBData<Message>];
  groupEvent: [PBData<Group>];
  userEvent: [PBData<User>];
}>();

console.log("Initializing PB Events");

(async () => {
  await pb.collection(Collections.Messages).subscribe<Message>("*", (data) => {
    pocketBaseHandler.emit("messageEvent", data as PBData<Message>);
  });

  await pb.collection(Collections.Groups).subscribe("*", (data) => {
    pocketBaseHandler.emit("groupEvent", data as PBData<Group>);
  });

  await pb.collection(Collections.Users).subscribe("*", (data) => {
    pocketBaseHandler.emit("userEvent", data as PBData<User>);
  });
})();
