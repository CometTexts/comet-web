import Pocketbase, { AuthModel } from "pocketbase";
import endpoints from "./endpoints.json";

export interface StoredAuth {
  token: string;
  model: AuthModel;
}

const pb = new Pocketbase(endpoints.pocketbase);

pb.autoCancellation(false);

export default pb;
