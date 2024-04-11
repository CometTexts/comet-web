import EventEmitter from "events";
import pb from "./pb";
import { Collections } from "./types";
import { RecordModel, RecordSubscription } from "pocketbase";

export type PBEventHandler<T = RecordModel> = (data: RecordSubscription<T>) => any;

export const pocketBaseHandler = new EventEmitter();

console.log("Initializing PB Events");

(async () => {
  await pb.collection(Collections.Messages).subscribe("*", (data) => {
    pocketBaseHandler.emit("messageEvent", data);
  });

  await pb.collection(Collections.Groups).subscribe("*", (data) => {
    pocketBaseHandler.emit("groupEvent", data);
  });

  await pb.collection(Collections.Users).subscribe("*", (data) => {
    console.log(data);
    pocketBaseHandler.emit("userEvent", data);
  });
})();
